import{T as f}from"./hooks.module-6e460002.js";import{o as c}from"./jsxRuntime.module-893eb125.js";const l="_iconButton_1bkfg_1",a="_icon_1bkfg_1",r={iconButton:l,icon:a};function k({children:i,disabled:o=!1,onClick:u,propagateEscapeKeyDown:t=!0,...s}){const e=f(function(n){n.key==="Escape"&&(t===!1&&n.stopPropagation(),n.currentTarget.blur())},[t]);return c("button",{...s,class:r.iconButton,disabled:o===!0,onClick:o===!0?void 0:u,onKeyDown:o===!0?void 0:e,tabIndex:o===!0?-1:0,children:c("div",{class:r.icon,children:i})})}export{k as I};
//# sourceMappingURL=icon-button-8696ab26.js.map
