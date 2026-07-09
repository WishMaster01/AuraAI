const Surface = ({ children, className = "", as, ...props }) => {
  const Component = as || "div";
  return (
    <Component
      className={`aura-glass rounded-lg ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Surface;
