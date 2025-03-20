import React from 'react';

const chibiUrls = [
  "https://i.pinimg.com/originals/fd/33/ec/fd33ec66afc1a13a0ea0f9c29131308f.png", // Lily
  "https://i.pinimg.com/originals/04/0c/a3/040ca3a8c80ed2886e2de92f9ce6b8a9.png", // Marigold
  "https://i.pinimg.com/originals/2d/a5/d3/2da5d3f04f8d1f2bbc9ebb1ad933e0d3.png", // Jun Lemon
  "https://i.pinimg.com/originals/4e/dd/79/4edd79939d6ca5ebcd4c09ca5d4001d8.png", // Happy chibi
  "https://i.pinimg.com/originals/a9/72/f1/a972f1cebca17e2f18f8898f8db53bc8.png"  // Cute chibi
];

const ChibiStickers: React.FC = () => {
  return (
    <>
      <div className="chibi-sticker sticker-1" style={{ backgroundImage: `url(${chibiUrls[0]})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}></div>
      <div className="chibi-sticker sticker-2" style={{ backgroundImage: `url(${chibiUrls[1]})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}></div>
      <div className="chibi-sticker sticker-3" style={{ backgroundImage: `url(${chibiUrls[2]})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}></div>
      <div className="chibi-sticker sticker-4" style={{ backgroundImage: `url(${chibiUrls[3]})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}></div>
      <div className="chibi-sticker sticker-5" style={{ backgroundImage: `url(${chibiUrls[4]})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}></div>
    </>
  );
};

export default ChibiStickers;