import React from 'react'
import TrailCard from './TrailCard'


export default function TrailGrid() {
  return (
    <div className='grid md:grid-cols-3 gap-6'>
        <TrailCard difficulty="Moderate"/>
        <TrailCard difficulty= "Easy"/>
        <TrailCard difficulty= "Difficult"/>
        <TrailCard difficulty="Moderate"/>
        <TrailCard difficulty= "Easy"/>
        <TrailCard difficulty= "Difficult"/>
    </div>
  )
}
