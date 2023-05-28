import{k as c}from"./preact.module-6cc36cb9.js";import{h as m}from"./hooks.module-6e460002.js";import{B as p}from"./button-b81342dc.js";import{T as d}from"./textbox-63b038aa.js";import{V as f}from"./vertical-space-1279b60e.js";import{u as F}from"./use-initial-focus-83cf3b2e.js";import{o as t}from"./jsxRuntime.module-893eb125.js";import"./create-class-name-71c46838.js";import"./loading-indicator-5157fb6e.js";import"./button.module-2bfe3ef2.js";import"./get-current-from-ref-47f174f6.js";import"./is-keycode-character-generating-0746a523.js";import"./mixed-values-e51728b2.js";import"./textbox.module-9ea46353.js";const _={title:"Hooks/Use Initial Focus"},e=function(){const[n,a]=m("Text"),s=F();function l(u){console.log(u)}return t(c,{children:[t(d,{...s,name:"text",onValueInput:a,value:n,variant:"border"}),t(f,{space:"small"}),t(p,{fullWidth:!0,onClick:l,children:"Submit"})]})};var o,i,r;e.parameters={...e.parameters,docs:{...(o=e.parameters)==null?void 0:o.docs,source:{originalSource:`function () {
  const [value, setValue] = useState<string>('Text');
  const initialFocus = useInitialFocus();
  function handleClick(event: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    console.log(event);
  }
  return <Fragment>
      <Textbox {...initialFocus} name="text" onValueInput={setValue} value={value} variant="border" />
      <VerticalSpace space="small" />
      <Button fullWidth onClick={handleClick}>
        Submit
      </Button>
    </Fragment>;
}`,...(r=(i=e.parameters)==null?void 0:i.docs)==null?void 0:r.source}}};const H=["UseInitialFocus"];export{e as UseInitialFocus,H as __namedExportsOrder,_ as default};
//# sourceMappingURL=use-initial-focus.stories-d8a9fafd.js.map
