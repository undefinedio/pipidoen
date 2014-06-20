/**
 * BinFileReader.js You can find more about this function at http://nagoon97.com/reading-binary-files-using-ajax/
 *
 * Copyright (c) 2008 Andy G.P. Na <nagoon97@naver.com> The source code is freely distributable under the terms of an
 * MIT-style license.
 *
 */
function BinFileReader(data) {

    var _exception = {
        FileLoadFailed: 1,
        EOFReached: 2,
        EmptyArray: 3
    };

    var filePointer = 0, fileSize = -1, fileContents = [], fileURL = "";

    this.getFileSize = function() {
        return fileSize;
    };

    this.getFilePointer = function() {
        return filePointer;
    };

    this.movePointerTo = function(iTo) {
        if (iTo < 0)
            filePointer = 0;
        else if (iTo > fileSize)	// once it is passed EOF
            throw new Error("Error: EOF reached");
        // throwException(_exception.EOFReached);
        else
            filePointer = iTo;

        return filePointer;
    };

    this.movePointer = function(iDirection) {
        this.movePointerTo(filePointer + iDirection);

        return filePointer;
    };

    this.readNumber = function(iNumBytes, iFrom) {
        iNumBytes = iNumBytes || 1;
        iFrom = iFrom || filePointer;

        this.movePointerTo(iFrom + iNumBytes);

        var result = 0;
        for ( var i = iFrom + iNumBytes; i > iFrom; i--) {
            result = result * 256 + this.readByteAt(i - 1);
        }

        return result;
    };

    this.readString = function(iNumChars, iFrom) {
        iNumChars = iNumChars || 1;
        iFrom = iFrom || filePointer;

        this.movePointerTo(iFrom);

        var result = "";
        var tmpTo = iFrom + iNumChars;
        for ( var i = iFrom; i < tmpTo; i++) {
            result += String.fromCharCode(this.readNumber(1));
        }

        return result;
    };

    this.readUnicodeString = function(iNumChars, iFrom) {
        iNumChars = iNumChars || 1;
        iFrom = iFrom || filePointer;

        this.movePointerTo(iFrom);

        var result = "";
        var tmpTo = iFrom + iNumChars * 2;
        for ( var i = iFrom; i < tmpTo; i += 2) {
            result += String.fromCharCode(this.readNumber(2));
        }

        return result;
    };

    /*
     function throwException(errorCode) {
     switch (errorCode) {
     case _exception.FileLoadFailed:
     throw new Error('Error: Failed to load "' + fileURL + '"');
     break;
     case _exception.EOFReached:
     throw new Error("Error: EOF reached");
     break;
     case _exception.EmptyArray:
     throw new Error("Error: Empty array detected");
     break;
     }
     }
     */

    /*
     function LoadFromIntegerArray(data) {

     if (data.length < 0)
     throw new Error("Error: Empty Integer Array detected");

     fileContents = data;
     fileSize = fileContents.length;

     if (fileSize < 0)
     throw new Error("Error: Empty array detected");
     // throwException(_exception.EmptyArray);

     this.readByteAt = function(i) {
     return data[i];
     };
     }
     */
    function LoadFromByteArray(data) {

        if (data.length < 0)
            throw new Error("Error: Empty Byte Array detected");

        fileContents = data;
        fileSize = fileContents.length;

        if (fileSize < 0)
            throw new Error("Error: Empty array detected");

        this.readByteAt = function(i) {
            return fileContents[i];
        };
    }
    function LoadFromString(data) {

        if (data.length < 0)
            throw new Error("Error: Empty String detected");

        fileContents = data;
        fileSize = fileContents.length;

        if (fileSize < 0)
            throw new Error("Error: Empty array detected");

        this.readByteAt = function(i) {
            return fileContents.charCodeAt(i) & 0xff;
        };
    }

    /*
     // These are functions that load using xhr, as opposed to process a previously downloaded response
     function BinFileReaderImpl_IE(url) {

     fileURL = url;

     var vbArr = IE_BinaryLoader_VBScript(fileURL);

     fileContents = vbArr.toArray();
     // fileContents = LoadFromIntegerArray.apply(this, IE_BinaryLoader_VBScript(fileURL).toArray());	// must try this one day

     fileSize = fileContents.length - 1;

     if (fileSize < 0)
     throwException(_exception.FileLoadFailed);

     this.readByteAt = function(i) {
     return fileContents[i];
     };
     }

     function BinFileReaderImpl(url) {
     var req = new XMLHttpRequest();

     fileURL = url;

     req.open('GET', fileURL, false);

     // XHR binary charset opt by Marcus Granado 2006 [http://mgran.blogspot.com]
     req.overrideMimeType('text/plain; charset=x-user-defined');
     req.send(null);

     if (req.status != 200)
     throwException(_exception.FileLoadFailed);

     fileContents = req.responseText;

     fileSize = fileContents.length;

     this.readByteAt = function(i) {
     return fileContents.charCodeAt(i) & 0xff;
     };
     }
     */
    // in the constructor

    switch (typeof data)
    {
        case "object":
            LoadFromByteArray.apply(this, [ data ]);
            break;
        case "string":
            LoadFromString.apply(this, [ data ]);
            break;
        case "undefined":
            throw new Error("data is undefined");
        default:
            throw new Error("data is unknown");
    }
    /*
     //next the download versions (not PreLoaded), not sure if they are used
     else if (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent))
     BinFileReaderImpl_IE.apply(this, [ fileURL ]);
     else
     BinFileReaderImpl.apply(this, [ fileURL ]);
     */
}

// global functions

function XHR_Level2_BinaryReader(xhr)
{
    if (xhr.response) {
        return new Uint8Array(xhr.response);
    }
}

function IE_BinaryReader(xhr)
{
    // bridge to VBS - toArray() converts back to Javascript
    // buffer returned by responseBody is one byte too long
    // This is removed in IE_BinaryReader_VBScript (rightly or wrongly)
    return IE_BinaryReader_VBScript(xhr).toArray();
}

// global statements

if (jq.browser.msie) {
    document.write('<script type="text/vbscript">\r\n\
	Function IE_BinaryLoader_VBScript(fileName)\r\n\
		Dim xhr\r\n\
		Set xhr = CreateObject("Microsoft.XMLHTTP")\r\n\
	\r\n\
		xhr.Open "GET", fileName, False\r\n\
	\r\n\
		xhr.setRequestHeader "Accept-Charset", "x-user-defined"\r\n\
		xhr.send\r\n\
	\r\n\
		if xhr.Status = 200 Then\r\n\
			IE_BinaryLoader_VBScript=IE_BinaryReader_VBScript(xhr)\r\n\
		End If\r\n\
	\r\n\
	End Function\r\n\
	\r\n\
	Function IE_BinaryReader_VBScript(xhr)\r\n\
	\r\n\
		Dim byteArray()\r\n\
		Dim i\r\n\
	\r\n\
		ReDim byteArray(LenB(xhr.responseBody)-1)\r\n\
		For i = 1 To LenB(xhr.responseBody)-1\r\n\
			byteArray(i-1) = AscB(MidB(xhr.responseBody, i, 1))\r\n\
		Next\r\n\
	\r\n\
		IE_BinaryReader_VBScript=byteArray\r\n\
	End Function\r\n\
	</script>\r\n');
}