export const genJWTMock = (data: object = {}, tte: number = 60 * 60) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  }
  const payload = {
    ...data,
    iat: (new Date().getTime()) + tte,
  }
  const signature = 'ONVz-KipOiKak4SvGq4mpv7TnArReus6HPuMeJR2geo'
  const header64 = btoa(JSON.stringify(header))
  const payload64 = btoa(JSON.stringify(payload))
  return `${header64}.${payload64}.${signature}`
}
