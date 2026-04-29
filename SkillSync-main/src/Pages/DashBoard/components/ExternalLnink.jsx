const ExternalLink = ({ href, children }) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};

// Usage
<ExternalLink href="https://mock-interview-lemon-gamma.vercel.app">Go to Google</ExternalLink>