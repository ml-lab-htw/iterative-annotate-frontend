import React, {ReactNode} from 'react';

type ContentWrapperProps = {
  children: ReactNode;
  className?: string;
  idName?: string;
  small?: boolean;
};

const ContentWrapper: React.FC<ContentWrapperProps> = (
    {children, className = "", idName, small = false}
) => {
  const maxWidth = small ? 'max-w-[800px]' : 'max-w-[1920px]';
  return (
      <div className={`block mx-auto ${maxWidth} px-4 sm:px-8 md:px-10 lg:px-12 xl:px-24 3xl:px-0 ${className}`}
           id={idName}>
        {children}
      </div>
  );
};

export default ContentWrapper;