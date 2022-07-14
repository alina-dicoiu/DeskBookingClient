var apiUrl = "https://localhost:7053/api/Company";

$(document).ready(function () {

    $("#save-company-button").click(function () {
        $("#add-company-alert").html("");
        let name = $("#company-name").val();
        let addr = $("#company-addr").val();

        if (name == "" || addr == "") {
            let error = `
            <div class="alert alert-danger " role="alert">
                Please fill in both fields!
            </div>`;
            $("#add-company-alert").append(error);
        } else {
            let post = {
                Name: name,
                Address: addr
            }

            $("#company-name").val("");
            $("#company-addr").val("");
            companies.save(post);
        }
    })
    $("#cancel-add-company-button").click(function () {
        $("#add-company-alert").html("");
        $("#company-name").val("");
        $("#company-addr").val("");
    })

    $(document).on("click", "#help", function () {
        let companyID = this.getAttribute("data-id");
        $("#delete-company-button").off("click").on("click", function () {
            companies.delete(companyID);
        })
    });
});

var companies = (function () {

    function loadCompanies() {
        $.ajax(apiUrl, {
                method: "GET",
                dataType: "json"
            })
            .done(function (data, status, jqXHR) {
                for (let i = 0; i < data.length; i++) {
                    $("#companies-body").append(newCardForCompany(data[i]));
                }
            })
            .fail(function (jqXHR, status, error) {
                $("#companies-body").append(newErrorMessage());
            });
    }


    function newCardForCompany(company) {
        return `          
        <div class="col-md-4" data-id=${company.id}>
            <div class="card mb-4 shadow-sm">
                <div class="bg-secondary company-header">
                    <button type="button" class="close" id="help" data-id=${company.id} data-toggle="modal" data-target="#delete-company-modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-header">
                    <h2>${company.name}</h2>
                </div>
                <div class="card-body">
                    <p class="card-text">Address: ${company.address}</p>
                </div>
            </div>
        </div>`;
    }

    function newErrorMessage() {
        return `
        <div class="alert alert-danger companies-error" role="alert">
            Could not load companies from server.
        </div>`;
    }

    function saveCompany(data) {
        return $.ajax(apiUrl, {
                method: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data)
            })
            .done(function (data, status, jqXHR) {
                $("#companies-body").append(newCardForCompany(data));
                $("#add-company-modal").modal('hide');
            })
            .fail(function (jqXHR, status, error) {
                console.log(error);
            })
    }

    function deleteCompany(id) {

        return $.ajax(apiUrl + "/" + id, {
                method: "DELETE"
            })
            .done(function (data, status, jqXHR) {
                $(".col-md-4[data-id=" + id + "]").remove();
                $("#delete-company-modal").modal('hide');
            })

            .fail(function (jqXHR, status, error) {
                console.log(error);
            })
    }

    return {
        load: loadCompanies,
        save: saveCompany,
        delete: deleteCompany
    }
})();