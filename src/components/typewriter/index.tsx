import Typewriter from "typewriter-effect";

const TypeWriter = ({
  texts,
  autoStart = false,
  loop = false,
}: {
  texts: string[];
  autoStart?: boolean;
  loop?: boolean;
}) => {
  return (
    <Typewriter
      options={{
        strings: texts,
        autoStart,
        loop,
      }}
    />
  );
};

export default TypeWriter;
