import FancyButton from './FancyButton';

// highlight-next-line
const ref = React.createRef();

// El componente FancyButton que importamos es el HOC LogProps.
// Aun así la salida renderizada será la misma,
// nuestra referencia apuntará a LogProps en lugar del componente FancyButton interno!
// Esto significa que no podemos llamar a por ejemplo: ref.current.focus()
// highlight-range{4}
<FancyButton
  label="Click Me"
  handleClick={handleClick}
  ref={ref}
/>;
