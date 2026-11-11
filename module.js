// Utility Functions & Application Helpers
window.AppModules = {
    formatDate: function(dateStr) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    },
    truncateText: function(text, limit = 100) {
        return text.length > limit ? text.substring(0, limit) + '...' : text;
    }
};