# Images directory

Static assets for the Price War Store live here. Refer to images via the Next.js public path, e.g. /images/....

Folders:
- product-gallery/: product detail/gallery images
- categories/: category thumbnails/badges
- banners/: homepage/landing banners and hero images
- brands/: brand logos
- homepage/: home section images not covered above
- icons/: custom icons not from an icon set

Notes:
- Commit static images you want to ship with the app.
- For user/admin uploads, prefer object storage (S3, Cloud Storage) and store URLs in DB.
