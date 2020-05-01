export const success = (body) => {
  return buildResponse(200, body);
};

export const failure = (body) => {
  return buildResponse(409, body);
};

export const custom = ({
  statusCode,
  response,
  contentType,
  location
}) => {
  console.log('**** custom callback active ****');
  console.log(statusCode);
  console.log(response);
  return buildResponse(statusCode, response, contentType, location);
};

export const imageBuffer = (statusCode, buffer, type) => {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': type,
    },
    body: buffer,
    isBase64Encoded: true
  };
};

const buildResponse = (statusCode, body, contentType, location) => {
  const response = {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body),
  };
  if (contentType) response.headers['Content-Type'] = contentType;
  if (location) response.headers.Location = location;
  return response;
};