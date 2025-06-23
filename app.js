const GRADIENT = "linear-gradient";
const GRADIENT_DIRECTION = "to right";
const INPUT_TYPE = "input[type='range']";

const colors = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll(INPUT_TYPE);
const shadesBtn = document.querySelectorAll(".shades");

const currentHex = document.querySelectorAll(".color h2");

const init = () => {
  document.addEventListener("click", (e) => {
    const clickedColor = e.target.closest(".color");

    document.querySelectorAll(".color").forEach((colorDiv) => {
      const shadesContainer = colorDiv.querySelector(".shades-container");

      if (!clickedColor || clickedColor !== colorDiv) {
        shadesContainer.innerHTML = "";
        shadesContainer.style.display = "none";
      }
    });
  });
};

const generateHex = () => {
  // const letters = "0123456789ABCDEF";
  // let hash = "#";

  // for (let i = 0; i < 6; i++) {
  //   hash += letters[Math.floor(Math.random() * 16)];
  // }
  // console.log(hash);
  // return hash;

  const color = chroma.random();
  return color;
};

const randomColors = () => {
  colors.forEach((color) => {
    const text = color.querySelector("h2");
    const hexColor = generateHex();

    color.style.backgroundColor = hexColor;
    text.textContent = hexColor;

    checkTextContrast(hexColor, text);
    slidersChange(color, hexColor);
  });
};

const slidersChange = (color, hexColor) => {
  const colorChroma = chroma(hexColor);
  const sliders = color.querySelectorAll(INPUT_TYPE);
  const hue = sliders[0];
  const saturation = sliders[1];
  const brightness = sliders[2];
  colorizeSliders(colorChroma, hue, saturation, brightness);
};

const colorizeSliders = (color, hue, saturation, brightness) => {
  sliderStrategies.saturation(color, saturation);
  sliderStrategies.brightness(color, brightness);
  sliderStrategies.hue(hue);
};

const sliderStrategies = {
  hue: (el) => {
    el.style.backgroundImage = `${GRADIENT}(${GRADIENT_DIRECTION}, rgb(204, 75, 75), rgb(204, 204, 75), rgb(75, 204, 75), rgb(75, 204, 204), rgb(75, 75, 204), rgb(204, 75, 204), rgb(204, 75, 75))`;
  },
  saturation: (color, el) => {
    const noSaturation = color.set("hsl.s", 0);
    const fullSaturation = color.set("hsl.s", 1);
    const scaleSaturation = chroma.scale([noSaturation, color, fullSaturation]);
    el.style.backgroundImage = `${GRADIENT}(${GRADIENT_DIRECTION}, ${scaleSaturation(
      0
    )}, ${scaleSaturation(1)})`;
  },
  brightness: (color, el) => {
    const midBrightness = color.set("hsl.l", 0.5);
    const scaleBrightness = chroma.scale(["black", midBrightness, "white"]);
    el.style.backgroundImage = `${GRADIENT}(${GRADIENT_DIRECTION}, ${scaleBrightness(
      0
    )}, ${scaleBrightness(0.5)}, ${scaleBrightness(1)})`;
  },
};

shadesBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const colorDiv = btn.closest(".color");
    const bgColor = window.getComputedStyle(colorDiv).backgroundColor;
    const baseColor = chroma(bgColor);
    createShades(baseColor, colorDiv);
  });
});

const createShades = (baseColor, parentDiv) => {
  const steps = 25;
  document.querySelectorAll(".shades-container").forEach((container) => {
    container.innerHTML = "";
    container.style.display = "none";
  });

  const shadesContainer = parentDiv.querySelector(".shades-container");

  shadesContainer.innerHTML = "";

  const scale = chroma.scale(["white", baseColor, "black"]).mode("lab");

  const colors = scale.colors(steps);

  renderColorShades(colors, shadesContainer);

  shadesContainer.style.display = "flex";
};

const updateSelectedShadeUI = (selectedColor, shadeElement) => {
  const shadeContainer = shadeElement.parentElement;
  const hexDisplayElement = shadeContainer.querySelector("h2");

  const color = chroma(selectedColor);
  shadeContainer.style.backgroundColor = color;
  hexDisplayElement.textContent = color;

  checkTextContrast(color, hexDisplayElement);
};

const renderColorShades = (colors, container) => {
  colors.forEach((color) => {
    const shadeElement = document.createElement("div");
    shadeElement.classList.add("shade");
    shadeElement.style.backgroundColor = color;

    const labelElement = document.createElement("span");
    labelElement.classList.add("shade-label");
    labelElement.textContent = color;
    labelElement.style.display = "none";

    shadeElement.appendChild(labelElement);
    showShadeName(shadeElement, labelElement, color);
    hideShadeName(shadeElement, labelElement);

    container.appendChild(shadeElement);

    shadeElement.addEventListener("click", () =>
      updateSelectedShadeUI(color, container)
    );
  });
};

const showShadeName = (shade, textSpan, color) => {
  shade.addEventListener("mouseenter", () => {
    textSpan.style.display = "block";
    checkTextContrast(color, textSpan);
  });
};

const hideShadeName = (shade, textSpan) => {
  shade.addEventListener("mouseleave", () => {
    textSpan.style.display = "none";
  });
};

const checkTextContrast = (color, text) => {
  const luminance = chroma(color).luminance();

  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
};

const hslControls = (e) => {
  const index =
    e.target.getAttribute("data-color-hue") ||
    e.target.getAttribute("data-color-saturation") ||
    e.target.getAttribute("data-color-brightness");

  let sliders = e.target.parentElement.querySelectorAll(INPUT_TYPE);
  const hue = sliders[0];
  const saturation = sliders[1];
  const brightness = sliders[2];

  const bgColor = colors[index].querySelector("h2").innerText;
  console.log(bgColor);
  let color = chroma(bgColor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value);

  colors[index].style.backgroundColor = color;
};

sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

randomColors();

init();
