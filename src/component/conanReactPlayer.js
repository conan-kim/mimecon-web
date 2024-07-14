import ReactPlayer from "react-player";

const ConanReactPlayer = ({ src }) => {
  return (
    <ReactPlayer
      url={src}
      config={{ file: { forceHLS: true } }}
      playing
      width={400}
      controls
      light
    />
  );
};

export default ConanReactPlayer;
