import math
from PIL import Image, ImageDraw

def render_civic_icon(size=512):
    # 4x supersampling for ultra-crisp rendering
    scale = 4
    canvas_size = size * scale
    img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Background Squircle with Deep Civic Gradient
    radius = int(canvas_size * 0.25)
    
    mask = Image.new("L", (canvas_size, canvas_size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, canvas_size, canvas_size], radius=radius, fill=255)

    grad_img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    grad_draw = ImageDraw.Draw(grad_img)

    top_color = (14, 90, 157, 255)      # #0E5A9D
    bottom_color = (6, 37, 68, 255)     # #062544
    for y in range(canvas_size):
        ratio = y / canvas_size
        r = int(top_color[0] * (1 - ratio) + bottom_color[0] * ratio)
        g = int(top_color[1] * (1 - ratio) + bottom_color[1] * ratio)
        b = int(top_color[2] * (1 - ratio) + bottom_color[2] * ratio)
        grad_draw.line([(0, y), (canvas_size, y)], fill=(r, g, b, 255))

    img.paste(grad_img, (0, 0), mask)

    # Border stroke (Cyan glow #38BDF8)
    border_draw = ImageDraw.Draw(img)
    border_draw.rounded_rectangle(
        [scale * 3, scale * 3, canvas_size - scale * 3, canvas_size - scale * 3], 
        radius=radius, 
        outline=(56, 189, 248, 160), 
        width=scale * 3
    )

    # 2. White Geo Pin
    cx = canvas_size / 2
    cy = canvas_size * 0.43
    pin_r = canvas_size * 0.28
    
    # Pin circular head
    draw.ellipse([cx - pin_r, cy - pin_r, cx + pin_r, cy + pin_r], fill=(255, 255, 255, 255))
    
    # Pin triangle tip
    tip_y = canvas_size * 0.84
    draw.polygon([
        (cx - pin_r * 0.96, cy + pin_r * 0.32),
        (cx + pin_r * 0.96, cy + pin_r * 0.32),
        (cx, tip_y)
    ], fill=(255, 255, 255, 255))

    # 3. Inner Dark Blue Hub
    inner_r = canvas_size * 0.13
    draw.ellipse([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r], fill=(6, 37, 68, 255))

    # 4. Vibrant Cyan Center Core Node
    core_r = canvas_size * 0.05
    draw.ellipse([cx - core_r, cy - core_r, cx + core_r, cy + core_r], fill=(56, 189, 248, 255))

    # 5. Bold Community "M" Arch in Electric Sky Cyan (#38BDF8)
    m_pts = [
        (cx - canvas_size * 0.16, canvas_size * 0.62),
        (cx - canvas_size * 0.08, canvas_size * 0.36),
        (cx, canvas_size * 0.48),
        (cx + canvas_size * 0.08, canvas_size * 0.36),
        (cx + canvas_size * 0.16, canvas_size * 0.62)
    ]
    draw.line(m_pts, fill=(56, 189, 248, 255), width=int(scale * 8), joint="round")

    # Downsample with highest quality Lanczos filter
    final_img = img.resize((size, size), Image.Resampling.LANCZOS)
    return final_img

# Generate all resolutions
icon_512 = render_civic_icon(512)
icon_192 = render_civic_icon(192)
icon_180 = render_civic_icon(180)
icon_64 = render_civic_icon(64)
icon_48 = render_civic_icon(48)
icon_32 = render_civic_icon(32)
icon_16 = render_civic_icon(16)

# Save high-res icons
icon_512.save("public/icon.png", format="PNG")
icon_512.save("src/app/icon.png", format="PNG")

icon_180.save("public/apple-touch-icon.png", format="PNG")
icon_180.save("public/apple-touch-icon-precomposed.png", format="PNG")
icon_180.save("src/app/apple-icon.png", format="PNG")

# Multi-resolution ICO for legacy and modern browsers
icon_64.save("public/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
icon_64.save("src/app/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

print("Successfully regenerated all high-definition civic favicons.")
