const wrapAction = (action, ...types) => {
    if (types.length === 0) {
        return action;
    } else {
        if (types.some(type => type.indexOf('.') !== -1)) {
            // eslint-disable-line
            throw new Error("Action type can't contain a dot");
        }

        return {
            ...action,
            type: `${types.join('.')}.${action.type}`,
        };
    }
};

export default wrapAction;
