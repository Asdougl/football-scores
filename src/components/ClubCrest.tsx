import { faShield } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import Image from 'next/image'
import type { FC } from 'react'
import { useState } from 'react'
import { pictureUrl } from '../utils/picture'

interface ClubCrestProps {
  imgUrl?: string
  alt?: string
  international?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const getImgSize = (
  size: ClubCrestProps['size'],
  international: ClubCrestProps['international']
): [x: number, y: number] => {
  if (!international) {
    switch (size) {
      case 'sm':
        return [32, 32]
      case 'md':
        return [48, 48]
      case 'lg':
        return [64, 64]
    }
  } else {
    switch (size) {
      case 'sm':
        return [32, 21]
      case 'md':
        return [48, 32]
      case 'lg':
        return [64, 42]
    }
  }
  return [32, 32]
}

export const ClubCrest: FC<ClubCrestProps> = ({
  imgUrl,
  alt,
  international,
  size = 'sm',
}) => {
  const [imgError, setImgError] = useState(false)

  const [width, height] = getImgSize(size, international)

  return imgUrl && !imgError ? (
    <Image
      src={pictureUrl(imgUrl, 4)}
      alt={alt || 'club'}
      width={width}
      height={height}
      className="rounded"
      onError={() => setImgError(true)}
    />
  ) : international ? (
    <div className="rounded bg-slate-600" style={{ height, width }} />
  ) : (
    <FontAwesomeIcon
      icon={faShield}
      className={classNames('text-slate-600', {
        'text-3xl': size === 'sm',
        'text-4xl': size === 'md',
        'text-6xl': size === 'lg',
      })}
    />
  )
}
