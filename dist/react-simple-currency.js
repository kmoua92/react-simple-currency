(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SimpleCurrencyInput = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var PropTypes = require('prop-types');

var SimpleCurrencyInput = (function (_React$Component) {
  _inherits(SimpleCurrencyInput, _React$Component);

  function SimpleCurrencyInput(props) {
    _classCallCheck(this, SimpleCurrencyInput);

    _get(Object.getPrototypeOf(SimpleCurrencyInput.prototype), 'constructor', this).call(this, props);

    this.onInputType = this.onInputType.bind(this);
    this.formattedRawValue = this.formattedRawValue.bind(this);
    this.getRawValue = this.getRawValue.bind(this);
    this.includesNegativeSymbol = this.includesNegativeSymbol.bind(this);
    this.resetNegativeOnDelete = this.resetNegativeOnDelete.bind(this);

    this.state = {
      rawValue: this.props.value,
      tabIndex: this.props.tabIndex,
      readOnly: this.props.readOnly,
      isNegative: false
    };
  }

  _createClass(SimpleCurrencyInput, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.notifyParentWithRawValue(this.state.rawValue);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.value || nextProps.value === 0) {
        this.setState({
          rawValue: nextProps.value
        });
      }
    }
  }, {
    key: 'resetNegativeOnDelete',
    value: function resetNegativeOnDelete(event) {
      var key = event.keyCode || event.charCode;
      var isBackspace = key === 8;
      var isDelete = key === 46;
      if ((isBackspace || isDelete) && this.state.isNegative && !this.state.rawValue) {
        this.setState({ isNegative: false });
      }
    }
  }, {
    key: 'onInputType',
    value: function onInputType(event) {
      var input = event.target.value;
      var isNegative = this.props.allowNegative && this.includesNegativeSymbol(input);
      var rawValue = this.getRawValue(input, isNegative);

      if (!rawValue) {
        rawValue = 0;
      }

      this.notifyParentWithRawValue(rawValue);

      this.setState({
        rawValue: rawValue,
        isNegative: isNegative
      });
    }
  }, {
    key: 'includesNegativeSymbol',
    value: function includesNegativeSymbol(input) {
      var regEx = new RegExp(/\-/g);
      var hasNegative = regEx.test(input);
      return hasNegative;
    }
  }, {
    key: 'notifyParentWithRawValue',
    value: function notifyParentWithRawValue(rawValue) {
      var display = this.formattedRawValue(rawValue);
      this.props.onInputChange(rawValue, display);
    }
  }, {
    key: 'getRawValue',
    value: function getRawValue(displayedValue, isNegative) {
      var result = displayedValue;

      result = removeOccurrences(result, this.props.delimiter, this.props.allowNegative);
      result = removeOccurrences(result, this.props.separator, this.props.allowNegative);
      result = removeOccurrences(result, this.props.unit, this.props.allowNegative);
      result = result.replace(/ /g, ''); // remove whitespaces so parseInt works for negative values

      var intValue = parseInt(result);
      if (this.props.allowNegative && isNegative && intValue > 0) {
        intValue = intValue * -1;
      }

      return intValue;
    }
  }, {
    key: 'formattedRawValue',
    value: function formattedRawValue(rawValue) {
      var minChars = '0'.length + this.props.precision;

      var result = '';
      result = '' + Math.abs(rawValue);

      if (result.length < minChars) {
        var leftZeroesToAdd = minChars - result.length;
        result = '' + repeatZeroes(leftZeroesToAdd) + result;
      }

      var beforeSeparator = result.slice(0, result.length - this.props.precision);
      var afterSeparator = result.slice(result.length - this.props.precision);

      if (beforeSeparator.length > 3) {
        var chars = beforeSeparator.split('').reverse();
        var withDots = '';
        for (var i = chars.length - 1; i >= 0; i--) {
          var char = chars[i];
          var dot = i % 3 === 0 ? this.props.delimiter : '';
          withDots = '' + withDots + char + dot;
        }
        withDots = withDots.substring(0, withDots.length - 1);
        beforeSeparator = withDots;
      }
      result = beforeSeparator + this.props.separator + afterSeparator;

      if (this.props.unit) {
        result = this.props.unit + ' ' + result;
      }

      if (this.props.allowNegative && this.state.isNegative) {
        result = '-' + result;
      }

      return result;
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement('input', {
        id: this.props.id,
        className: this.props.className,
        onBlur: this.props.onInputBlur,
        onFocus: this.props.onInputFocus,
        onChange: this.onInputType,
        value: this.formattedRawValue(this.state.rawValue),
        disabled: this.props.disabled,
        autoFocus: this.props.autoFocus,
        tabIndex: this.state.tabIndex,
        readOnly: this.state.readOnly,
        autoComplete: this.props.autoComplete,
        autoCorrect: this.props.autoCorrect,
        name: this.props.name,
        placeholder: this.props.placeholder,
        onKeyDown: this.resetNegativeOnDelete
      });
    }
  }]);

  return SimpleCurrencyInput;
})(React.Component);

var repeatZeroes = function repeatZeroes(times) {
  var result = '';
  var i = 0;
  for (i = 0; i < times; i++) {
    result += '0';
  }

  return result;
};

var removeOccurrences = function removeOccurrences(from, toRemove, allowNegative) {
  if (allowNegative) {
    toRemove = toRemove.replace(/[\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  } else {
    toRemove = toRemove.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  }

  var re = new RegExp(toRemove, 'g');
  return from.replace(re, '');
};

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
  allowNegative: PropTypes.bool
};

SimpleCurrencyInput.defaultProps = {
  value: 0,
  precision: 2,
  separator: '.',
  delimiter: ',',
  unit: '',
  disabled: false,
  autoFocus: false,
  onInputChange: function onInputChange() {},
  onInputBlur: function onInputBlur() {},
  onInputFocus: function onInputFocus() {},
  allowNegative: false
};

exports['default'] = SimpleCurrencyInput;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"prop-types":undefined}]},{},[1])(1)
});
