import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import QRCode from 'qrcode'
import downloadIcon from './images/download-icon.svg'

const blankImage = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

//

const DownloadOverlay = ({ dataURL }) => {
  const handleClickDownload = () => {
    const link = document.createElement('a')
    link.download = `qr-code.png`
    link.href = dataURL
    link.click()
  }

  return (
    <Fragment>
      <div className="download-overlay">
        <button className="download-button" onClick={ handleClickDownload }>
          DOWNLOAD QR CODE <img src={ downloadIcon } />
        </button>
      </div>
    </Fragment>
  )
}

DownloadOverlay.propTypes = {
  dataURL: PropTypes.string.isRequired,
}
//

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
        />
          {
            !dataURL && (
              <p className="instruction-box">
                Enter text to generate a QR code
              </p>
            )
          }
          { dataURL && <DownloadOverlay dataURL={ dataURL } /> }
        </main>

    </Fragment>
  )
}
