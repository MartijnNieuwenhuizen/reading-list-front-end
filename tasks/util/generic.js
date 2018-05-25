/**
 * @param {Error} error
 */
export function swallowError(error) {
    console.log(
        (error.stack ? error.stack : error).toString()
    );
    this.emit('end');
}
