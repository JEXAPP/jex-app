import cloudinary
import cloudinary.uploader
from typing import Optional

def upload_image(file, folder: str = "default", public_id: Optional[str] = None):
    """
    Sube una imagen a Cloudinary.
    :param file: archivo (Django UploadedFile o ruta)
    :param folder: carpeta donde guardarlo en Cloudinary
    :param public_id: ID opcional para sobreescribir una imagen existente
    :return: dict con 'url', 'public_id', etc.
    """
    try:
        result = cloudinary.uploader.upload(
            file,
            folder=folder,
            public_id=public_id,
            overwrite=True,
            resource_type="image"
        )
        return {
            "url": result["secure_url"],
            "public_id": result["public_id"]
        }
    except Exception as e:
        raise Exception(f"Cloudinary upload failed: {e}")