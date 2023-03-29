import axios from "axios";

export const extractIdFromUrl = (url) => {
      let urlArr = url.split('/');
      return urlArr[urlArr.length - 1] == '/' || urlArr[urlArr.length - 1] == ''
                    ? urlArr[urlArr.length - 2]
                    : urlArr[urlArr.length - 1];
}

export const getByUrl = async url => {
      return await axios
          .get(url, {
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Token ${process.env.REACT_APP_TOKEN}`,
              },
              withCredentials: false,
          })
          .then((res) => {
              return res.data;
          })
          .catch((error) => {
              return error;
          });
}

