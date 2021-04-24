/** @jsx h */
import { ComponentChildren, h, JSX } from 'preact'

import type { Props } from '../../../types'
import { LoadingIndicator } from '../loading-indicator/loading-indicator'
import styles from './loading.css'

export interface LoadingProps {
  children: ComponentChildren
}

export function Loading({
  children,
  ...rest
}: Props<HTMLDivElement, LoadingProps>): JSX.Element {
  return (
    <div {...rest} className={styles.loading}>
      <div className={styles.wrapper}>
        <div class={styles.loadingIndicator}>
          <LoadingIndicator />
        </div>
        {children}
      </div>
    </div>
  )
}