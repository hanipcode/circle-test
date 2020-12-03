import Page from '#/components/Page';
import TEST_ID from '#/constants/testIds';
import { getGiphyDetail } from '#/helpers/api';
import { GetSingleImageResponse } from '#/helpers/interfaces/GetImageListResponse';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

type ImageData = GetSingleImageResponse['data'];

const Detail: React.FC = () => {
  const [imageData, setImageData] = useState<ImageData>();
  const { query } = useRouter();
  const { id } = query;
  console.log(query);

  useEffect(() => {
    if (!id) {
      return;
    }
    getImageInfo();
  }, [id]);

  const getImageInfo = useCallback(async () => {
    const response = await getGiphyDetail(id as string);
    setImageData(response.data);
  }, [id]);

  return (
    <Page data-testid={TEST_ID.DETAIL}>
      {imageData && (
        <div className="img-container">
          <img
            className="img-detail"
            src={imageData?.images?.fixed_height.url}
          />
        </div>
      )}
      {imageData && (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Property Name</th>
              <th>Property Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(imageData).map((key) => (
              <tr key={key}>
                <td>{key}</td>
                <td>
                  <code>{JSON.stringify(imageData[key], null, 2)}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Page>
  );
};

export default Detail;
