from __future__ import annotations
from pathlib import Path
import base64, io
import qrcode
import qrcode.image.svg

def svg_bytes(url: str) -> bytes:
    image=qrcode.make(url,image_factory=qrcode.image.svg.SvgPathImage,box_size=10,border=4)
    stream=io.BytesIO(); image.save(stream); return stream.getvalue()

def png_bytes(url: str) -> bytes:
    image=qrcode.make(url,box_size=10,border=4); stream=io.BytesIO(); image.save(stream,format='PNG'); return stream.getvalue()

def write_qr(url: str, svg_path: Path, png_path: Path) -> None:
    svg_path.write_bytes(svg_bytes(url)); png_path.write_bytes(png_bytes(url))

def svg_data_uri(url: str) -> str:
    return 'data:image/svg+xml;base64,'+base64.b64encode(svg_bytes(url)).decode()
