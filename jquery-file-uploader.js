(function($) {

    function _changePlaceholderText(placeholder, placeholderText) {
        placeholder.attr('placeholder', placeholderText)
    }

    function _renderHTML(placeholder, buttonText) {
        return (`
            <div class="file-select">
                <div class="file-select-name" id="noFile">${placeholder}</div>
                <div class="file-select-button" id="fileName">${buttonText}</div>
            </div>
            <div id="img-list"></div>
        `);
    }

    function _renderListHTML(name, index) {
        return (`
            <div id="item-${index}" class="file-list-item-wrapper">
                <div class="file-left">
                    <img class="list-type-img" src="./img/documents.png">
                </div>
                <div class="file-right">${name}</div>
                <div class="close-icon" data-id="item-${index}" data-name="${name}" data-input-index="${index}"><img src="./img/close.png"></div>
            </div>
        `)
    }

    async function _deleteItemFromList(tht, name) {
        const fileInput = tht.find('input[type="file"]')[0]

        const dataTransfer = new DataTransfer()

        let file = {};
        let newFileList = [...fileInput.files].filter(item => (item.name != name))
        for (var y = 0; y < newFileList.length; y++) {
            file = new File([`id-${name}`], newFileList[y].name, { type: newFileList[y].type })
            dataTransfer.items.add(file)
        }

        fileInput.files = await dataTransfer.files;
        await _reRender(tht.find('input[type="file"]')[0]);
    }

    function _reRender(that) {
        var selectedFiles = that.files;
        var list = "";
        for (var i = 0; i < selectedFiles.length; i++) {
            list += _renderListHTML(selectedFiles[i].name, i)
        }
        $('#img-list').html(list)


    }

    $.fn.uploader = function(options) {

        var settings = $.extend({
            color: "#556b2f",
            backgroundColor: "white",
            placeholder: "No file chosen...",
            buttonText: "Choose File"

        }, options);

        const tht = this;
        const that = this.find("input[type='file']");
        this.append(_renderHTML(settings.placeholder, settings.buttonText));

        that.change(function() {
            _reRender(that[0])
        });

        that.css({
            opacity: 0,
            height: "100%"
        });

        $(document).on('click', '.close-icon', function() {
            console.log($(this).attr('data-input-index'))
            _deleteItemFromList(tht, $(this).attr('data-name'))
        });


        this.addClass('fileUploader');

        _changePlaceholderText(that, settings.placeholder)
        _renderHTML(settings.placeholder, settings.buttonText)

        that.css({
            color: settings.color,
            backgroundColor: settings.backgroundColor
        });
    };

}(jQuery));