"""Preview the custom Jekyll profile without requiring a local Ruby install.

This renders only the profile layout's deliberately small Liquid subset.
GitHub Pages still performs the production Jekyll build.
"""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlsplit, unquote
import re, html

ROOT=Path(__file__).resolve().parents[1]
PAGES={'/projects/split-merge-mapping/':'mapping.md','/':'about.md','/cv/':'cv.md','/404.html':'404.md','/sitemap/':'sitemap.md','/about/':'about.md','/about.html':'about.md','/resume':'cv.md'}

def render(name, route):
    page=(ROOT/'_pages'/name).read_text(encoding='utf-8')
    _,front,body=page.split('---',2)
    title=re.search(r'^title: *"([^"]*)"',front,re.M).group(1)
    match=re.search(r'^description: *"([^"]*)"',front,re.M)
    description=match.group(1) if match else 'Computer engineer working across robotics, control, and reliable data systems.'
    layout=(ROOT/'_layouts/profile.html').read_text(encoding='utf-8').replace('{{ content }}',body)
    layout=layout.replace('{{ page.title }}',html.escape(title)).replace('{{ page.description | default: site.description | escape }}',html.escape(description))
    layout=layout.replace('{{ page.url | absolute_url }}','https://mohammad-momeni.github.io'+route)
    layout=re.sub(r"{{\s*'([^']*)'\s*\|\s*(relative_url|absolute_url)\s*}}",lambda m: ('https://mohammad-momeni.github.io' if m[2]=='absolute_url' else '')+m[1],layout)
    if '{{' in layout or '{%' in layout:raise ValueError('Unrendered Liquid')
    return layout.encode('utf-8')

class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
    def do_GET(self):
        path=unquote(urlsplit(self.path).path)
        if path in PAGES:
            content=render(PAGES[path],path)
            self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(content)));self.end_headers();self.wfile.write(content)
        elif path.startswith(('/assets/','/images/','/files/')):
            super().do_GET()
        else:
            self.send_error(404)

if __name__=='__main__':
    print('Local preview: http://127.0.0.1:4173',flush=True)
    ThreadingHTTPServer(('127.0.0.1',4173),Handler).serve_forever()
