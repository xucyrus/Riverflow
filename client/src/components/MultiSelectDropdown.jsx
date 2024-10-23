import React from 'react'
import Select, { StylesConfig } from 'react-select'

const MAX_SELECTIONS = 3

// 選項
const options = [
  { value: 1, label: 'DJ' },
  { value: 2, label: '街舞' },
  { value: 3, label: '饒舌' },
  { value: 4, label: '塗鴉' },
  { value: 5, label: '滑板' },
  { value: 6, label: '新品' },
  { value: 7, label: '優惠' }
]

const MultiSelectDropdown = ({ selectedOptions, onChange }) => {
  const handleChange = (selected) => {
    if (selected.length <= MAX_SELECTIONS) {
      onChange(selected)
    }
  }

  const colourStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'transparent',
      borderColor: state.isFocused ? 'var(--main)' : 'black'
    }),
    options: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'black': 'black',
      color: state.isSelected ? 'var(--main)' : 'white'
    })
  }

  return (
    <div className='infoItem editTitle'>
      <label htmlFor='prdSort' className='editTitle'>
        商品分類：
      </label>
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder="選擇商品分類"
        styles={colourStyles}
      />
      <span className='required'>※請選擇至多三個分類</span>
    </div>
  )
}
export default MultiSelectDropdown
