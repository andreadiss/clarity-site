import random
from PIL import Image, ImageDraw, ImageFont

# Percorso dell'immagine di base (modifica se necessario)
base_image_path = "C:/Users/andre/Desktop/website/images/prove/im3.png"
base_img = Image.open(base_image_path).convert("RGBA")
width, height = base_img.size

num_frames = 30
stream_speed = 3
font_size = 25
stream_color = (176, 176, 176)

# Utilizza il percorso assoluto per il font (assicurati che il file esista)
font_path = "C:/Windows/Fonts/arial.ttf"
font = ImageFont.truetype(font_path, font_size)

num_streams = 20
stream_positions = [random.randint(0, width - font_size) for _ in range(num_streams)]
start_ys = [random.randint(-height, 0) for _ in range(num_streams)]
frames = []

for frame_index in range(num_frames):
    frame = base_img.copy()
    draw = ImageDraw.Draw(frame)
    
    for i in range(num_streams):
        x = stream_positions[i]
        start_y = start_ys[i] + frame_index * stream_speed
        y = start_y
        
        while y < height:
            binary_digit = random.choice(['0', '1'])
            draw.text((x, y), binary_digit, font=font, fill=stream_color)
            y += font_size

    frames.append(frame)

gif_path_doubled = "C:/Users/andre/Desktop/website/images/ngo_hero.gif"
frames[0].save(
    gif_path_doubled,
    save_all=True,
    append_images=frames[1:],
    duration=100,
    loop=0,
    disposal=2
)

print(f"GIF creata con successo e salvata in: {gif_path_doubled}")
