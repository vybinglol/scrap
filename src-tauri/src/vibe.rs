// Desktop implementation of the vibe extraction pipeline — the native
// equivalent of app/api/vibe/route.ts. Given a URL it finds the og:image, fetches
// the bytes, and returns the dominant colors. All the palette/mood/contrast math
// stays in the shared TS (lib/vibe.ts), so this returns the exact same shape as
// the web Route Handler. Native HTTP means no browser CORS / canvas-taint issues.

use image::imageops::FilterType;
use regex::Regex;
use serde::Serialize;
use std::collections::HashMap;
use std::time::Duration;

const UA: &str = "Mozilla/5.0 (compatible; ScrapableBot/1.0; +https://scrapable.app)";

#[derive(Serialize)]
pub struct ColorCount {
    pub hex: String,
    pub count: u32,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RawVibe {
    pub image_url: Option<String>,
    pub title: Option<String>,
    pub colors: Vec<ColorCount>,
}

impl RawVibe {
    fn empty() -> Self {
        RawVibe {
            image_url: None,
            title: None,
            colors: vec![],
        }
    }
}

// Pull a <meta property|name="prop" content="..."> value, attribute order agnostic.
fn meta(html: &str, property: &str) -> Option<String> {
    let p = regex::escape(property);
    let patterns = [
        format!(r#"(?i)<meta[^>]+(?:property|name)=["']{p}["'][^>]+content=["']([^"']+)["']"#),
        format!(r#"(?i)<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']{p}["']"#),
    ];
    for pat in patterns {
        if let Ok(re) = Regex::new(&pat) {
            if let Some(caps) = re.captures(html) {
                if let Some(m) = caps.get(1) {
                    return Some(m.as_str().to_string());
                }
            }
        }
    }
    None
}

#[tauri::command]
pub async fn extract_vibe(url: String) -> Result<RawVibe, String> {
    let client = reqwest::Client::builder()
        .user_agent(UA)
        .timeout(Duration::from_secs(9))
        .build()
        .map_err(|e| e.to_string())?;

    // 1) Fetch the page and pull the og:image / og:title.
    let page = match client.get(&url).send().await {
        Ok(r) if r.status().is_success() => r,
        _ => return Ok(RawVibe::empty()),
    };
    let html = match page.text().await {
        Ok(t) => t,
        Err(_) => return Ok(RawVibe::empty()),
    };

    let image_url = meta(&html, "og:image");
    let title = meta(&html, "og:title");

    let Some(img_url) = image_url.clone() else {
        return Ok(RawVibe {
            image_url: None,
            title,
            colors: vec![],
        });
    };

    // 2) Fetch the image bytes.
    let bytes = match client.get(&img_url).send().await {
        Ok(r) if r.status().is_success() => match r.bytes().await {
            Ok(b) => b,
            Err(_) => {
                return Ok(RawVibe {
                    image_url,
                    title,
                    colors: vec![],
                })
            }
        },
        _ => {
            return Ok(RawVibe {
                image_url,
                title,
                colors: vec![],
            })
        }
    };

    // 3) Decode + dominant-color histogram (mirrors the web's sharp pipeline).
    let colors = match image::load_from_memory(&bytes) {
        Ok(img) => dominant_colors(&img),
        Err(_) => vec![],
    };

    Ok(RawVibe {
        image_url,
        title,
        colors,
    })
}

// Downscale to 48x48 and bucket pixels into a 16x16x16 grid; return the top 8
// most-populated buckets averaged to their true color.
fn dominant_colors(img: &image::DynamicImage) -> Vec<ColorCount> {
    let small = img.resize_exact(48, 48, FilterType::Triangle).to_rgb8();

    // key -> (count, r_sum, g_sum, b_sum)
    let mut buckets: HashMap<u32, (u32, u32, u32, u32)> = HashMap::new();
    for px in small.pixels() {
        let [r, g, b] = px.0;
        let key = ((r as u32 >> 4) << 8) | ((g as u32 >> 4) << 4) | (b as u32 >> 4);
        let e = buckets.entry(key).or_insert((0, 0, 0, 0));
        e.0 += 1;
        e.1 += r as u32;
        e.2 += g as u32;
        e.3 += b as u32;
    }

    let mut entries: Vec<(u32, u32, u32, u32)> = buckets.into_values().collect();
    entries.sort_by(|a, b| b.0.cmp(&a.0));
    entries
        .into_iter()
        .take(8)
        .map(|(count, rs, gs, bs)| {
            let r = (rs / count) as u8;
            let g = (gs / count) as u8;
            let b = (bs / count) as u8;
            ColorCount {
                hex: format!("#{r:02x}{g:02x}{b:02x}"),
                count,
            }
        })
        .collect()
}
