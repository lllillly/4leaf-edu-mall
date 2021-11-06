import { createGlobalStyle, css } from "styled-components";

const fontCss = css`
  @font-face {
    font-family: "BMJUA";
    src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff")
      format("woff");
    font-weight: normal;
    font-style: normal;
  }
`;

const GlobalStyles = createGlobalStyle`
${fontCss}

body{
    font-family:"BMJUA",sans-serif
}
`;

export default GlobalStyles;
