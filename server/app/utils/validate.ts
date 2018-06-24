const NOT_ENOUGH_DATA = "Not enough data";

export const validateRequestBody = (req, required) => {
    for (let attr of required) {
        if (!req.body[attr]) {
            return NOT_ENOUGH_DATA;
        }
  
        switch (typeof required[attr]) {
            case "object":
                for (let detail of required[attr]) {
                    if (!req.body[attr][detail]) {
                        return NOT_ENOUGH_DATA;
                    }
                }
                break;
        }
    }
    return null;
}
