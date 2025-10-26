import { Section } from '../types';
import { CATEGORIES } from '../constants';

export const generateHtmlForDownload = (title: string, image: string, sections: Section[]): string => {
  const categoriesJson = JSON.stringify(CATEGORIES);
  const sectionsJson = JSON.stringify(sections);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        html, body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; 
            margin: 0; 
            padding: 0;
            background-color: #f1f5f9; 
            color: #334155; 
            height: 100%;
            width: 100%;
            overflow: hidden;
        }
        .container { 
            display: flex;
            height: 100%; 
            width: 100%; 
        }
        .image-panel { 
            background-color: #e2e8f0; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            padding: 1rem;
            flex: 2;
            min-width: 0;
            overflow-y: auto; /* Allow vertical scroll for tall images */
            overflow-x: hidden; /* Prevent horizontal scroll */
        }
        .image-wrapper { 
            position: relative; 
            line-height: 0; /* Prevents extra space below image */
            display: inline-block; /* Shrink-to-fit image */
            margin: auto; /* Ensures centering within flex container */
        }
        img.guide-image { 
            display: block;
            max-width: 100%; 
            height: auto; /* Maintain aspect ratio */
            object-fit: contain; 
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); 
            border-radius: 0.25rem;
        }
        .content-panel { 
            background-color: #ffffff; 
            padding: 2rem; 
            overflow-y: auto;
            flex: 1;
            min-width: 320px;
            box-shadow: -5px 0 15px -3px rgba(0,0,0,0.1);
            z-index: 10;
        }
        .pin { 
            position: absolute; 
            width: 1.5rem; 
            height: 1.5rem; 
            border-radius: 9999px; 
            transform: translate(-50%, -50%); 
            cursor: pointer; 
            transition: all 0.2s; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 0.75rem; 
            color: white; 
            font-weight: bold; 
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); 
        }
        .pin:hover { 
            transform: translate(-50%, -50%) scale(1.2); 
        }
        .content-placeholder { 
            text-align: center; 
            color: #94a3b8; 
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
        }
        h1 { font-size: 1.5rem; font-weight: bold; margin: 0; word-break: break-word; }
        .content-html { line-height: 1.6; }
        .content-html img { max-width: 100%; height: auto; border-radius: 0.25rem; margin: 0.5rem 0; }
        .header-bar { 
            border-bottom-width: 4px; 
            padding-bottom: 0.75rem; 
            margin-bottom: 1rem; 
            display: flex; 
            align-items: center; 
            gap: 0.75rem;
        }
        .header-icon { 
            width: 2rem; 
            height: 2rem; 
            border-radius: 9999px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: white; 
            font-weight: bold; 
            flex-shrink: 0;
        }

        @media (max-width: 768px) {
            html, body { 
                height: auto; 
                overflow: auto; 
            }
            .container { 
                flex-direction: column;
                height: auto; 
            }
            .image-panel { 
                min-height: 60vh;
                padding: 0.5rem;
                /* On mobile, allow image to have some scroll, but don't force it to take up the whole screen height */
                align-items: flex-start; 
            }
            .content-panel {
                min-width: unset;
                box-shadow: 0 -5px 15px -3px rgba(0,0,0,0.1);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div id="image-panel" class="image-panel">
            <div id="image-wrapper" class="image-wrapper">
                <img src="${image}" alt="Guide Image" class="guide-image" />
            </div>
        </div>
        <div id="content-panel" class="content-panel">
             <div class="content-placeholder">
                <h2>${title}</h2>
                <p>Click a pin on the image to view details.</p>
            </div>
        </div>
    </div>
    <script>
        const sections = ${sectionsJson};
        const categories = ${categoriesJson};
        const imageWrapper = document.getElementById('image-wrapper');
        const contentPanel = document.getElementById('content-panel');
        let activePin = null;

        function renderPins() {
            // Clear existing pins before rendering
            imageWrapper.querySelectorAll('.pin').forEach(p => p.remove());
            sections.forEach((section, index) => {
                const pin = document.createElement('div');
                pin.className = 'pin';
                pin.style.left = \`\${section.x}%\`;
                pin.style.top = \`\${section.y}%\`;
                pin.style.backgroundColor = categories[section.categoryKey].color;
                pin.dataset.id = section.id;
                pin.innerText = index + 1;
                pin.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handlePinClick(section, pin, index + 1)
                });
                imageWrapper.appendChild(pin);
            });
        }

        function handlePinClick(section, pinElement, index) {
            if (activePin) {
                activePin.style.transform = 'translate(-50%, -50%) scale(1)';
                activePin.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';

            }
            activePin = pinElement;
            pinElement.style.transform = 'translate(-50%, -50%) scale(1.25)';
            pinElement.style.boxShadow = '0 0 0 3px white, 0 0 0 5px ' + categories[section.categoryKey].color;

            const category = categories[section.categoryKey];
            const escapedTitle = section.title.replace(/</g, "&lt;").replace(/>/g, "&gt;");

            contentPanel.innerHTML = \`
                <div class="header-bar" style="border-color: \${category.color};">
                    <div class="header-icon" style="background-color: \${category.color};">\${index}</div>
                    <h1 style="color: \${category.color};">\${escapedTitle}</h1>
                </div>
                <div class="content-html">\${section.content}</div>
            \`;
        }
        
        document.addEventListener('DOMContentLoaded', () => {
            const guideImage = imageWrapper.querySelector('.guide-image');
            // Ensure pins are rendered after image has loaded to get correct dimensions
            if (guideImage.complete) {
                renderPins();
            } else {
                guideImage.onload = () => {
                    renderPins();
                };
            }
        });

    </script>
</body>
</html>
  `;
};
