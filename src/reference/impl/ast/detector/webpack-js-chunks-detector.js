export default function detect(body) {
    // TODO: fix hardcoded value
    if (body.startsWith("(this.webpackChunkdiscord_app=this.webpackChunkdiscord_app||[])")) {
        return false;
    }

    // TODO: fix hardcoded value
    if (body.startsWith('"use strict";(this.webpackChunkdiscord_app=this.webpackChunkdiscord_app||[])')) {
        return false;
    }

    // TODO: fix hardcoded value
    if (body.includes("(this.webpackChunkdiscord_app=this.webpackChunkdiscord_app||[])")) {
        return false;
    }

    /////

    return true;
}
