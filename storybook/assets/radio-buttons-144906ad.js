import{T as u}from"./hooks.module-6e460002.js";import{S as z}from"./stack-75d3944d.js";import{c as v}from"./create-class-name-71c46838.js";import{o as s}from"./jsxRuntime.module-893eb125.js";const B="_radioButtons_1s9z6_1",y="_label_1s9z6_6",A="_input_1s9z6_10",I="_disabled_1s9z6_20",D="_fill_1s9z6_24",g="_border_1s9z6_39",k="_children_1s9z6_60",e={radioButtons:B,label:y,input:A,disabled:I,fill:D,border:g,children:k},_="data-radio-buttons-item-id";function M({disabled:b=!1,name:r,onChange:d=function(){},onValueChange:c=function(){},options:n,propagateEscapeKeyDown:o=!0,space:f="small",value:h,...m}){const p=u(function(t){const l=t.currentTarget.getAttribute(_),i=n[parseInt(l,10)].value;c(i,r),d(t)},[r,d,c,n]),T=u(function(t){t.key==="Escape"&&(o===!1&&t.stopPropagation(),t.currentTarget.blur())},[o]);return s("div",{class:e.radioButtons,children:s(z,{space:f,children:n.map(function(t,l){const i=typeof t.children>"u"?`${t.value}`:t.children,a=b===!0||t.disabled===!0;return s("label",{class:v([e.label,a===!0?e.disabled:null]),children:[s("input",{...m,checked:h===t.value,class:e.input,disabled:a===!0,name:r,onChange:p,onKeyDown:T,tabIndex:a===!0?-1:0,type:"radio",value:`${t.value}`,[_]:`${l}`}),s("div",{class:e.fill}),s("div",{class:e.border}),s("div",{class:e.children,children:i})]},l)})})})}export{M as R};
//# sourceMappingURL=radio-buttons-144906ad.js.map
