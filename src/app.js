import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

const blankImage = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

export const App = () => {
  const image = useRef()
  const input = useRef()
 
  const [text, setText] = useState('')
  const [dataURL, setDataURL] = useState('')

  const handleChangeValue = event => {
    setText(event.target.value)
  }

  useEffect(() => {
    input.current?.focus()
  }, [])

  useEffect(() => {
    if (!text) {
      setDataURL(null)
      return
    }
    generateCode(text)
  }, [text])

  const generateCode = useCallback(async text => {
    QRCode.toDataURL(text, { width: 400, margin: 1 })
      .then(url => {
        setDataURL(url)
      })
      .catch(error => {
        console.error(error.message)
      })
  }, [])

  const handleClickImage = event => {
    const link = document.createElement('a')
    link.download = `qr-code.png`
    link.href = dataURL
    link.click()
  }

  return (
    <Fragment>
      <header>
        <input
          value={ text }
          onChange={ handleChangeValue }
          className="text-input"
          placeholder="Enter text..."
          autoFocus
        />
      </header>

      <main>
        <img
          src={ dataURL ?? blankImage }
          ref={ image }
          className="code-image"
          style={{ filter: `opacity(${ dataURL ? 1 : 0 })` }}
          onClick={ handleClickImage }
        />{
          !dataURL && (
            <p className="instruction-box">
              Enter text to generate a QR code
            </p>
          )
        }</main>

    </Fragment>
  )
}
