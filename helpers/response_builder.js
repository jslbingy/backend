let rb = {
    build: function build(data, message, status) {
        try {
            let response = {
                status: status || 200,
                message: message || ``,
                data: data || {},
            }
            return response;
        } catch (err) {
            return rb.buildError(err);
        }
    },
    buildError: function buildError(message, status, data, accept200) {
        let response = "";
        if (message.status == 200) {
            if (accept200) {

            } else {
                delete message.status;
            }
        }
        if (message instanceof Error) {
            response =
                {
                    status: message.status || 500,
                    message: message.message || "",
                    data: data || {}
                }
        } else {
            response =
                {
                    status: status || 500,
                    message: message || "",
                    data: data || {},
                }
        }
        return response;
    }
};

module.exports = rb;