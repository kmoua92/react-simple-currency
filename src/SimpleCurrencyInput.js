var React = require('react')
var PropTypes = require('prop-types')

class SimpleCurrencyInput extends React.Component {
  constructor(props) {
    super(props)

    this.onInputType = this.onInputType.bind(this)
    this.formattedRawValue = this.formattedRawValue.bind(this)
    this.getRawValue = this.getRawValue.bind(this)
    this.includesNegativeSymbol = this.includesNegativeSymbol.bind(this)
    this.resetNegativeOnDelete = this.resetNegativeOnDelete.bind(this)

    this.state = {
      rawValue: this.props.value,
      tabIndex: this.props.tabIndex,
      readOnly: this.props.readOnly,
      isNegative: false,
    }
  }

  componentWillMount() {
      this.notifyParentWithRawValue(this.state.rawValue)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value || nextProps.value === 0) {
      this.setState({
        rawValue: nextProps.value
      })
    }
  }

  resetNegativeOnDelete(event) {
    const key = event.keyCode || event.charCode
    const isBackspace = key === 8
    const isDelete = key === 46
    if ((isBackspace || isDelete) && this.state.isNegative && !this.state.rawValue) {
      this.setState({isNegative: false})
    }
  }

  onInputType (event) {
    const input = event.target.value
    const isNegative = this.props.allowNegative && this.includesNegativeSymbol(input)
    let rawValue = this.getRawValue(input, isNegative)

    if (!rawValue) {
      rawValue = 0
    }

    this.notifyParentWithRawValue(rawValue)

    this.setState({
      rawValue,
      isNegative,
    })
  }

  includesNegativeSymbol(input) {
    const regEx = new RegExp(/\-/g)
    const hasNegative = regEx.test(input)
    return hasNegative
  }

  notifyParentWithRawValue (rawValue) {
    let display = this.formattedRawValue(rawValue)
    this.props.onInputChange(rawValue, display)
  }

  getRawValue (displayedValue, isNegative) {
    let result = displayedValue

    result = removeOccurrences(result, this.props.delimiter, this.props.allowNegative)
    result = removeOccurrences(result, this.props.separator, this.props.allowNegative)
    result = removeOccurrences(result, this.props.unit, this.props.allowNegative)
    result = result.replace(/ /g, '') // remove whitespaces so parseInt works for negative values


    let intValue = parseInt(result)
    if (this.props.allowNegative && isNegative && intValue > 0) {
      intValue = intValue * -1
    }

    return intValue
  }

  formattedRawValue (rawValue) {
    const minChars = '0'.length + this.props.precision

    let result = ''
    result = `${Math.abs(rawValue)}`

    if (result.length < minChars) {
      const leftZeroesToAdd = minChars - result.length
      result = `${repeatZeroes(leftZeroesToAdd)}${result}`
    }

    let beforeSeparator = result.slice(0, result.length - this.props.precision)
    let afterSeparator = result.slice(result.length - this.props.precision)

    if (beforeSeparator.length > 3) {
      var chars = beforeSeparator.split('').reverse()
      let withDots = ''
      for (var i = chars.length -1; i >= 0; i--) {
        let char = chars[i]
        let dot = i % 3 === 0 ? this.props.delimiter : ''
        withDots = `${withDots}${char}${dot}`
      }
      withDots = withDots.substring(0, withDots.length - 1)
      beforeSeparator = withDots
    }
    result = beforeSeparator + this.props.separator + afterSeparator

    if (this.props.unit) {
      result = `${this.props.unit} ${result}`
    }

    if (this.props.allowNegative && this.state.isNegative) {
      result = `-${result}`
    }

    return result
  }

  render() {
    return (
      <input
				id={this.props.id}
        className={this.props.className}
        onBlur={this.props.onInputBlur}
        onFocus={this.props.onInputFocus}
        onChange={this.onInputType}
        value={this.formattedRawValue(this.state.rawValue)}
        disabled={this.props.disabled}
        autoFocus={this.props.autoFocus}
        tabIndex={this.state.tabIndex}
        readOnly={this.state.readOnly}
        autoComplete={this.props.autoComplete}
        autoCorrect={this.props.autoCorrect}
        name={this.props.name}
        placeholder={this.props.placeholder}
        onKeyDown={this.resetNegativeOnDelete}
      />
    )
  }
}

const repeatZeroes = (times) => {
  let result = ''
  let i = 0
  for (i = 0; i < times; i++) {
    result += '0'
  }

  return result
}

const removeOccurrences = (from, toRemove, allowNegative) => {
  if (allowNegative) {
    toRemove = toRemove.replace(/[\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
  } else {
    toRemove = toRemove.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
  }

  var re = new RegExp(toRemove, 'g')
  return from.replace(re, '')
}

SimpleCurrencyInput.propTypes = {
  id: PropTypes.string,
  autoFocus: PropTypes.bool,
  delimiter: PropTypes.string,
  disabled: PropTypes.bool,
  onInputChange: PropTypes.func,
  onInputBlur: PropTypes.func,
  onInputFocus: PropTypes.func,
  precision: PropTypes.number,
  readOnly: PropTypes.bool,
  separator: PropTypes.string,
  tabIndex: PropTypes.number,
  unit: PropTypes.string,
  value: PropTypes.number.isRequired,
  allowNegative: PropTypes.bool,
}

SimpleCurrencyInput.defaultProps = {
  value: 0,
  precision: 2,
  separator: '.',
  delimiter: ',',
  unit: '',
  disabled: false,
  autoFocus: false,
  onInputChange: () => {},
  onInputBlur: () => {},
  onInputFocus: () => {},
  allowNegative: false,
}

export default SimpleCurrencyInput
