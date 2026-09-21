from PIL import Image, ImageDraw
import math

def render_civic_icon(size=512):
    # Create 4x supersampled image for ultra crisp antialiasing
    scale = 4
    canvas_size = size * scale
    img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Rounded rectangle background with civic blue gradient
    radius = int(canvas_size * 0.22)
    
    # We draw smooth gradient inside the rounded rect
    mask = Image.new("L", (canvas_size, canvas_size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, canvas_size, canvas_size], radius=radius, fill=255)

    grad_img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    grad_draw = ImageDraw.Draw(grad_img)

    # Civic Navy to Deep Ocean Blue gradient (#0B4F8A to #072C4F)
    top_color = (11, 79, 138, 255)
    bottom_color = (7, 44, 79, 255)
    for y in range(canvas_size):
        ratio = y / canvas_size
        r = int(top_color[0] * (1 - ratio) + bottom_color[0] * ratio)
        g = int(top_color[1] * (1 - ratio) + bottom_color[1] * ratio)
        b = int(top_color[2] * (1 - ratio) + bottom_color[2] * ratio)
        grad_draw.line([(0, y), (canvas_size, y)], fill=(r, g, b, 255))

    img.paste(grad_img, (0, 0), mask)

    # Border stroke
    border_draw = ImageDraw.Draw(img)
    border_draw.rounded_rectangle([scale * 2, scale * 2, canvas_size - scale * 2, canvas_size - scale * 2], 
                                  radius=radius, outline=(56, 189, 248, 120), width=scale * 3)

    # 2. White map pin
    cx, cy = canvas_size / 2, canvas_size * 0.44
    pin_r = canvas_size * 0.26
    
    # Pin head (circle)
    draw.ellipse([cx - pin_r, cy - pin_r, cx + pin_r, cy + pin_r], fill=(255, 255, 255, 255))
    
    # Pin point (triangle to bottom)
    tip_y = canvas_size * 0.82
    draw.polygon([
        (cx - pin_r * 0.94, cy + pin_r * 0.35),
        (cx + pin_r * 0.94, cy + pin_r * 0.35),
        (cx, tip_y)
    ], fill=(255, 255, 255, 255))

    # Inner cutout ring
    inner_r = canvas_size * 0.11
    draw.ellipse([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r], fill=(11, 79, 138, 255))

    # 3. Stylized Community "M" in Sky Blue (#38BDF8)
    m_pts = [
        (cx - canvas_size * 0.15, canvas_size * 0.60),
        (cx - canvas_size * 0.075, canvas_size * 0.38),
        (cx, canvas_size * 0.48),
        (cx + canvas_size * 0.075, canvas_size * 0.38),
        (cx + canvas_size * 0.15, canvas_size * 0.60)
    ]
    draw.line(m_pts, fill=(56, 189, 248, 255), width=int(scale * 7), joint="round")

    # Downsample with highest quality Lanczos filter
    final_img = img.resize((size, size), Image.Resampling.LANCZOS)
    return final_img

# Generate all required PNG and ICO assets
icon_512 = render_civic_icon(512)
icon_192 = render_civic_icon(192)
icon_180 = render_civic_icon(180)
icon_64 = render_civic_icon(64)
icon_32 = render_civic_icon(32)
icon_16 = render_civic_icon(16)

# Save to public and src/app
icon_512.save("public/icon.png", format="PNG")
icon_512.save("src/app/icon.png", format="PNG")

icon_180.save("public/apple-touch-icon.png", format="PNG")
icon_180.save("public/apple-touch-icon-precomposed.png", format="PNG")
icon_180.save("src/app/apple-icon.png", format="PNG")

# Multi-resolution true-alpha favicon.ico
icon_64.save("public/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
icon_64.save("src/app/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

print("Successfully generated all civic blue icon and favicon assets.")
