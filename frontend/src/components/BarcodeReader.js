import React, { useState, useEffect } from 'react';
import Quagga from 'quagga';

const BarcodeScanner = () => {
  const [barcode, setBarcode] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const constraints = {
      video: {
        facingMode: 'environment',
      },
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        Quagga.init({
          inputStream: {
            name: 'Live',
            type: 'LiveStream',
            constraints: {
              ...constraints,
              aspectRatio: {
                min: 1,
                max: 2,
              },
              width: {
                min: 640,
              },
              height: {
                min: 480,
              },
            },
            target: document.querySelector('#scanner'),
          },
          decoder: {
            readers: ['ean_reader'],
          },
        }, (err) => {
          if (err) {
            setError(err);
            return;
          }

          Quagga.start();

          return () => {
            Quagga.stop();
          };
        });

        Quagga.onDetected((data) => {
          setBarcode(data.codeResult.code);
        });

        return () => {
          stream.getTracks().forEach((track) => track.stop());
        };
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <div id="scanner" style={{ width: '100%', height: 'auto' }} />
      {barcode && <p>Barcode: {barcode}</p>}
    </div>
  );
};

export default BarcodeScanner;
