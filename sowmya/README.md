# Sowmya Boya Portfolio

Single-page static portfolio built with HTML5, CSS3, and vanilla JavaScript.

## Project Structure

- index.html
- css/style.css
- js/script.js
- files/Sowmya_Boya_Resume.pdf
- images/

## Local Preview

Open index.html directly in a browser or use a static server:

```bash
cd /Users/vicky/Downloads/portfolio/sowmya
python3 -m http.server 8080
```

Then open http://localhost:8080.

## AWS S3 Static Hosting

1. Create a new S3 bucket (for example: sowmya-portfolio).
2. Disable Block Public Access for this bucket only.
3. Upload all files and folders from this directory.
4. Enable Static website hosting in bucket Properties.
5. Set index document to index.html.
6. Set error document to index.html.
7. Add this bucket policy (replace bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

## Content-Type and Cache Guidance

- .html -> text/html; charset=utf-8
- .css -> text/css; charset=utf-8
- .js -> application/javascript; charset=utf-8
- .pdf -> application/pdf
- images -> image/jpeg or image/png

Suggested cache control:

- HTML: max-age=3600
- CSS/JS/Images/PDF: max-age=31536000 (if filenames are versioned)

## Optional CloudFront

Use CloudFront in front of S3 if you want:

- HTTPS with custom domain
- Better performance and caching
- Route 53 alias support

For this single-page site, section navigation is hash-based (for example: #about), which works cleanly on S3 static hosting.

## Other Static Deployment Targets

### GitHub Pages

1. Push this folder to a GitHub repository.
2. In repository settings, open Pages.
3. Set source to the branch and folder containing index.html.
4. Save and open the generated Pages URL.

### Netlify

1. Create a new site from Git.
2. Use this folder as publish directory.
3. Build command is not required for this static site.
4. Deploy and use the generated Netlify URL.

### Vercel

1. Import the repository in Vercel.
2. Framework preset: Other.
3. Build command: empty.
4. Output directory: . (project root for this folder).
5. Deploy.
