export const pictureUrl = (url: string, size: number) => {
  return url.replace('{format}', 'sq').replace('{size}', size.toString())
}
