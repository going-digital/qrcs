IMG=\
	dist/img/qrcs57.png\
	dist/img/qrcs72.png\
	dist/img/qrcs76.png\
	dist/img/qrcs114.png\
	dist/img/qrcs120.png\
	dist/img/qrcs128.png\
	dist/img/qrcs144.png\
	dist/img/qrcs152.png\
	dist/img/qrcs180.png\
	dist/img/qrcs192.png

CSS=\
	stylesheets/github-light.css\
	stylesheets/normalize.css\
	stylesheets/stylesheet.css

QRJS=\
	ALPHA_NUM.js\
	NUMBER.js\
	QR8BitByte.js\
	QRBitBuffer.js\
	QRCode.js\
	QRErrorCorrectLevel.js\
	QRMaskPattern.js\
	QRMath.js\
	QRMode.js\
	QRPolynomial.js\
	QRRSBlock.js\
	QRUtil.js\
	cssvg.js\
	urlshrink.js

TARGET=\
	dist\
	dist/min.css\
	dist/index.html\
	dist/qr.min.js\
	dist/share.min.js\
	$(IMG)

all: $(TARGET)

clean:
	rm -f qr.js
	rm -Rf dist

dist:
	mkdir dist

dist/share.min.js:
	cp share.min.js dist/share.min.js

dist/img: dist
	mkdir dist/img

dist/index.html: index.html
	cp index.html dist/index.html

dist/min.css: dist $(CSS)
	cat $(CSS) | csscrush > dist/min.css

dist/qr.min.js: dist $(QRJS)
	cat $(QRJS) | uglifyjs -o qr.js
	minify --output dist/qr.min.js qr.js
	rm qr.js

dist/img/qrcs57.png: dist/img qrcs.png
	convert qrcs.png -resize 57x57 dist/img/qrcs57.png
dist/img/qrcs72.png: dist/img qrcs.png
	convert qrcs.png -resize 72x72 dist/img/qrcs72.png
dist/img/qrcs76.png: dist/img qrcs.png
	convert qrcs.png -resize 76x76 dist/img/qrcs76.png
dist/img/qrcs114.png: dist/img qrcs.png
	convert qrcs.png -resize 114x114 dist/img/qrcs114.png
dist/img/qrcs120.png: dist/img qrcs.png
	convert qrcs.png -resize 120x120 dist/img/qrcs120.png
dist/img/qrcs128.png: dist/img qrcs.png
	convert qrcs.png -resize 128x128 dist/img/qrcs128.png
dist/img/qrcs144.png: dist/img qrcs.png
	convert qrcs.png -resize 144x144 dist/img/qrcs144.png
dist/img/qrcs152.png: dist/img qrcs.png
	convert qrcs.png -resize 152x152 dist/img/qrcs152.png
dist/img/qrcs180.png: dist/img qrcs.png
	convert qrcs.png -resize 180x180 dist/img/qrcs180.png
dist/img/qrcs192.png: dist/img qrcs.png
	convert qrcs.png -resize 192x192 dist/img/qrcs192.png
