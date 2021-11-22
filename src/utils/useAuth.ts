import React, { useEffect, useState } from 'react';
import axios from 'axios';

const useAuth = (code: string) => {
  const [accessToken, setAccessToken] = useState<string>();
  const [refreshToken, setRefreshToken] = useState<string>();
  const [expiresIn, setExpiresIn] = useState<number>();

  useEffect(() => {
    if (code) {
      axios
        .post('http://localhost:5000/auth/login', {
          code,
        })
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setRefreshToken(res.data.refreshToken);
          setExpiresIn(res.data.expiresIn);
          window.history.pushState({}, '', '/');
        })
        .catch(() => {
          window.location.href = '/';
        });
    }
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return undefined;
    const interval = setInterval(() => {
      axios
        .post('http://localhost:5000/auth/refresh', {
          refreshToken,
        })
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
        })
        .catch(() => {
          window.location.href = '/';
        });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);
  return accessToken;
};

export default useAuth;
