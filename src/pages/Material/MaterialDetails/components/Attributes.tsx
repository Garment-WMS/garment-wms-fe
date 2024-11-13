import React from 'react'

type Props = {
    attributes?: any[]
}

const Attributes: React.FC<Props> = ({attributes}) => {
    if(!attributes || attributes.length === 0) {
        return <div>No attributes</div>
    }
  return (
    <div>
      {Object.entries(attributes).map(([key, value], index) => (
        <div key={index} className="attribute-item">
          <strong>{key}:</strong> {JSON.stringify(value)}
        </div>
      ))}
    </div>
  )
}

export default Attributes