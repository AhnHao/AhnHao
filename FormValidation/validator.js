//Object 'validator'
function validator(options) {

    function getParent(element, selector) {
        while(element.parentElement) {
           if(element.parentElement.matches(selector)) {
            return element.parentElement
           } 
           element = element.parentElement
        }
    }

    var selectorRules = {}

    //Hàm thực hiện validate
    function validate(inputElement, rule) { 
        
        var formMessage = getParent(inputElement, options.fromGroupSelector).querySelector(options.errorSelector)
        var errorMessage

        //Lấy ra các rules của selector
        var rules = selectorRules[rule.selector]
        
        //Lặp qua từng rule & kiểm tra
        //Nếu có lỗi thì dừng việc kiểm tra
        for(var i=0; i< rules.length; i++) {
            switch(inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    )
                    break
                default:
                    errorMessage = rules[i](inputElement.value)
            }
            if(errorMessage) break
        }
                    
        if(errorMessage) {
            formMessage.innerText = errorMessage
            getParent(inputElement, options.fromGroupSelector).classList.add('invalid')
        } else {
            formMessage.innerText = ''
            getParent(inputElement, options.fromGroupSelector).classList.remove('invalid')
        }

        return !errorMessage
    }

    //Lấy element của form cần validate
    var formElement = document.querySelector(options.form)

    if(formElement) {
        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormValid = true

            //Lặp qua từng rule và validate
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule)
                if(!isValid) {
                    isFormValid = false
                }
            })


            if(isFormValid) {
                //Trường hợp submit với javascript
                if(typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]')
                    var formValues = Array.from(enableInputs).reduce(function(values, input) {
                        
                        switch(input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="'+input.name+'"]:checked').value
                                break
                            case 'checkbox':
                                if(!input.matches(':checked')) {
                                    values[input.name] = ''
                                    return values
                                }    

                                if(!Array.isArray(values[input.name])) {
                                    values[input.name] = []
                                }

                                values[input.name].push(input.value)
                                break
                            case 'file':
                                values[input.name] = input.files
                                break
                            default:
                                values[input.name] = input.value
                        }

                        return values
                    }, {})

                    options.onSubmit(formValues)
                }
                //Trường  hợp submit với hành vi mặc định
                else {
                    formElement.submit()
                }
            }
        }

        //Lặp qua mỗi rule và xử lý
        options.rules.forEach(function(rule) {
            
            //Lưu lại các rule cho mỗi input
            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test]
            }
            
            var inputElements = formElement.querySelectorAll(rule.selector)

            Array.from(inputElements).forEach(function(inputElement) {
                if(inputElement) {
                    //Xử lí blur khỏi input
                    inputElement.onblur = function() {
                        validate(inputElement, rule)
                    }
    
                    //Xử lí khi nhập lại
                    inputElement.oninput = function() {
                        var formMessage = getParent(inputElement, options.fromGroupSelector).querySelector(options.errorSelector)
                        formMessage.innerText = ''
                        getParent(inputElement, options.fromGroupSelector).classList.remove('invalid')
                    }
                }
            })
        });
    }
}



validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value ? undefined : message || 'Vui lòng nhập nội dung'
        }
    }
}

validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return emailRegex.test(value) ? undefined : message || 'Vui lòng nhập chính xác email'
        }
    }
}

validator.minLength = function(selector, min, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập vào tối thiểu ${min} ký tự`
        }
    }
}

validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị không hợp lệ'
        }
    }
}
