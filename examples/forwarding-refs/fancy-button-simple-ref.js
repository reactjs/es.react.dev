// highlight-range{1-2}
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// Ahora puedes obtener una referencia directa al boton del DOM:
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
