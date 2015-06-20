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

CSSCRUSH=csscrush
UGLIFYJS=uglifyjs
MINIFY=minify
CONVERT=convert
PNGQUANT=pngquant
OPTIPNG=optipng

all: $(TARGET)

clean:
	rm -f qr.js
	rm -Rf dist

dist:
	rm -Rf dist
	mkdir dist

dist/share.min.js:
	cp share.min.js dist/share.min.js

dist/img: dist
	rm -Rf dist/img
	mkdir dist/img

dist/index.html: index.html
	cp index.html dist/index.html

dist/min.css: dist $(CSS)
	cat $(CSS) | $(CSSCRUSH) > dist/min.css

dist/qr.min.js: dist $(QRJS)
	cat $(QRJS) | $(UGLIFYJS) -o qr.js
	$(MINIFY) --output dist/qr.min.js qr.js
	rm qr.js

dist/img/qrcs57.png: qrcs.png dist/img
	$(CONVERT) $< -resize 57x57 temp.png
	$(PNGQUANT) 16 temp.png -o temp2.png
	rm temp.png
	$(OPTIPNG) temp2.png -out $@
	rm temp2.png

dist/img/qrcs72.png: qrcs.png dist/img
	$(CONVERT) $< -resize 72x72 temp.png
	$(PNGQUANT) 16 temp.png -o temp2.png
	rm temp.png
	$(OPTIPNG) temp2.png -out $@
	rm temp2.png

dist/img/qrcs76.png: qrcs.png dist/img
	$(CONVERT) $< -resize 76x76 temp.png
	$(PNGQUANT) 16 temp.png -o temp2.png
	rm temp.png
	$(OPTIPNG) temp2.png -out $@
	rm temp2.png

dist/img/qrcs114.png: qrcs.png dist/img
	$(CONVERT) $< -resize 114x114 temp.png
	$(PNGQUANT) 16 temp.png -o temp2.png
	rm temp.png
	$(OPTIPNG) temp2.png -out $@
	rm temp2.png

dist/img/qrcs120.png: qrcs.png dist/img
	$(CONVERT) $< -resize 120x120 temp.png
	$(PNGQUANT) 16 temp.png -o temp2.png
	rm temp.png
	$(OPTIPNG) temp2.png -out $@
	rm temp2.png

dist/img/qrcs128.png: qrcs.png dist/img
	$(CONVERT) $< -resize 128x128 temp.png
	$(PNGQUANT) 16 temp.png -o temp2.png
	rm temp.png
	$(OPTIPNG) temp2.png -out $@
	rm temp2.png

dist/img/qrcs144.png: qrcs.png dist/img
	$(CONVERT) $< -resize 144x144 temp.png
	$(PNGQUANT) 16 temp.png -o temp2.png
	rm temp.png
	$(OPTIPNG) temp2.png -out $@
	rm temp2.png

dist/img/qrcs152.png: qrcs.png dist/img
	$(CONVERT) $< -resize 152x152 temp.png
	$(PNGQUANT) 16 temp.png -o temp2.png
	rm temp.png
	$(OPTIPNG) temp2.png -out $@
	rm temp2.png

dist/img/qrcs180.png: qrcs.png dist/img
	$(CONVERT) $< -resize 180x180 temp.png
	$(PNGQUANT) 16 temp.png -o temp2.png
	rm temp.png
	$(OPTIPNG) temp2.png -out $@
	rm temp2.png

dist/img/qrcs192.png: qrcs.png dist/img
	$(CONVERT) $< -resize 192x192 temp.png
	$(PNGQUANT) 16 temp.png -o temp2.png
	rm temp.png
	$(OPTIPNG) temp2.png -out $@
	rm temp2.png
