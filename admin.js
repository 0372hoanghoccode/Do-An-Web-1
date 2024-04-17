function checkLogin() {
    let currentUser = JSON.parse(localStorage.getItem("currentuser"));
        document.getElementById("name-acc").innerHTML = currentUser.fullname;
}
window.onload = checkLogin();
let menuIconButton = document.querySelector(".menu-icon-btn");
let sidebar = document.querySelector(".sidebar");
menuIconButton.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});
const sidebars = document.querySelectorAll(".sidebar-list-item.tab-content");
const sections = document.querySelectorAll(".section");

for(let i = 0; i < sidebars.length; i++) {
    sidebars[i].onclick = function () {
        document.querySelector(".sidebar-list-item.active").classList.remove("active");
        document.querySelector(".section.active").classList.remove("active");
        sidebars[i].classList.add("active");
        sections[i].classList.add("active");
    };
}
const closeBtn = document.querySelectorAll('.section');
console.log(closeBtn[0])
for(let i=0;i<closeBtn.length;i++){
    closeBtn[i].addEventListener('click',(e) => {
        sidebar.classList.add("open");
    })
}
function showProduct1() {
    let selectOp = document.getElementById('the-loai').value;
    let valeSearchInput = document.getElementById('form-search-product').value;
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];

    if(selectOp == "Tất cả") {
        result = products.filter((item) => item.status == 1);
    } else if(selectOp == "Đã xóa") {
        result = products.filter((item) => item.status == 0);
    } else {
        result = products.filter((item) => item.category == selectOp);
    }
    result = valeSearchInput == "" ? result : result.filter(item => {
        return item.title.toString().toUpperCase().includes(valeSearchInput.toString().toUpperCase());
    })
    displayList(result, perPage, currentPage);
    setupPagination(result, perPage, currentPage);
}

function xoaHinhAnh(event) {
    event.preventDefault(); 
    var uploadInput = document.getElementById('up-hinh-anh');
    var preview = document.getElementById('hinh-anh-preview');
    var newUploadInput = uploadInput.cloneNode(true);
    uploadInput.parentNode.replaceChild(newUploadInput, uploadInput);
    newUploadInput.value = '';
    preview.src = '';
}

function getAmoumtProduct() {
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
    return products.length;
}
function getAmoumtUser() {
    let accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : [];
    return accounts.filter(item => item.userType == 0).length;
}
function getAmoumtOrder(){
    let order = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
    return order.length;
}
function getMoney() {
    let tongtien = 0;
    let orders = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
    orders.forEach(item => {
        if(item.trangthai === 1)//xử lý xong mới có tiền
        {
        tongtien += item.tongtien
        }
    });
    return tongtien;
}
document.getElementById("amount-user").innerHTML = getAmoumtUser();
document.getElementById("amount-product").innerHTML = getAmoumtProduct();
document.getElementById("amount-order").innerHTML = getAmoumtOrder();
document.getElementById("doanh-thu").innerHTML = vnd(getMoney());
function vnd(price) {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}
let perPage = 12;
let currentPage = 1;
function displayList(productAll, perPage, currentPage) {
    let start = (currentPage - 1) * perPage;
    let end = (currentPage - 1) * perPage + perPage;
    let productShow = productAll.slice(start, end);
    showProductArr(productShow);
}
function setupPagination(productAll, perPage) {
    document.querySelector('.page-nav-list').innerHTML = '';
    let page_count = Math.ceil(productAll.length / perPage);
    if(page_count > 1){
    for (let i = 1; i <= page_count; i++) {
        let li = paginationChange(i, productAll, currentPage);
        document.querySelector('.page-nav-list').appendChild(li);
     }
    }
}
function paginationChange(page, productAll, currentPage) {
    let node = document.createElement(`li`);
    node.classList.add('page-nav-item');
    node.innerHTML = `<a href="#">${page}</a>`;
    if (currentPage == page) node.classList.add('active');
    node.addEventListener('click', function () {
        currentPage = page;
        displayList(productAll, perPage, currentPage);
        let t = document.querySelectorAll('.page-nav-item.active');
        
        for (let i = 0; i < t.length; i++) {
            t[i].classList.remove('active');
        }
        node.classList.add('active');
    })
    return node;
}
function showProductArr(arr) {
    let productHtml = "";
    if(arr.length == 0) {
        productHtml = `<div class="no-result"><div class="no-result-i"><i class="fa fa-home"></i></div><div class="no-result-h">Không có sản phẩm để hiển thị</div></div>`;
    } else {
        arr.forEach(product => {
            let btnCtl = product.status == 1 ? 
            `<button class="btn-delete" onclick="deleteProduct(${product.id})"><i class="fa fa-trash"></i></button>` :
            `<button class="btn-delete" onclick="changeStatusProduct(${product.id})"><i class="fa fa-pencil"></i></button>`;
            productHtml += `
            <div class="list">
                    <div class="list-left">
                    <img src="${product.img}" alt="">
                    <div class="list-info">
                        <h4>${product.title}</h4>
                        <p class="list-note">${product.desc}</p>
                        <span class="list-category">${product.category}</span>
                    </div>
                </div>
                <div class="list-right">
                    <div class="list-price">
                    <span class="list-current-price">${vnd(product.price)}</span>                   
                    </div>
                    <div class="list-control">
                    <div class="list-tool">
                        <button class="btn-edit" onclick="editProduct(${product.id})"><i class="fa fa-pencil"></i></button>
                        ${btnCtl}
                    </div>                       
                </div>
                </div> 
            </div>`;
        });
    }
    document.getElementById("show-product").innerHTML = productHtml;
}
function showProduct() {
    let valeSearchInput = document.getElementById('form-search-product').value;
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
    result = products.filter((item) => item.status == 1);
    result = valeSearchInput == "" ? result : result.filter(item => {
        return item.title.toString().toUpperCase().includes(valeSearchInput.toString().toUpperCase());
    })
    displayList(result, perPage, currentPage);
    setupPagination(result, perPage, currentPage);
}
function cancelSearchProduct() {
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")).filter(item => item.status == 1) : [];
    document.getElementById('the-loai').value = "Tất cả";
    document.getElementById('form-search-product').value = "";
    displayList(products, perPage, currentPage);
    setupPagination(products, perPage, currentPage);
}
window.onload = showProduct();
function createId(arr) {
    let id = arr.length;
    let check = arr.find((item) => item.id == id);
    while (check != null) {
        id++;
        check = arr.find((item) => item.id == id);
    }
    return id;
}
// Xóa sản phẩm 
// function deleteProduct(id) {
//     let products = JSON.parse(localStorage.getItem("products"));
//     let index = products.findIndex(item => {
//         return item.id == id;
//     })
//     if (confirm("Bạn có chắc muốn xóa?") == true) {
//         products[index].status = 0;
//         toast({ title: 'Thành công', message: 'Xóa sản phẩm thành công !', type: 'success', duration: 2000 });
//     }
//     localStorage.setItem("products", JSON.stringify(products));
//     showProduct();
// }

function deleteProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    let index = products.findIndex(item => item.id == id);

    // Hiển thị giao diện xác nhận
    document.getElementById('overplay').style.display = 'flex';

    // Xử lý sự kiện khi nhấn nút Xóa
    document.getElementById('delete-btn').addEventListener('click', function() {
      // Thực hiện xóa sản phẩm
      products[index].status = 0;
      localStorage.setItem("products", JSON.stringify(products));
      showProduct();

      // Ẩn giao diện xác nhận
      document.getElementById('overplay').style.display = 'none';
    });

    // Xử lý sự kiện khi nhấn nút Hủy
    document.getElementById('cancel-btn').addEventListener('click', function() {
      // Ẩn giao diện xác nhận
      document.getElementById('overplay').style.display = 'none';
    });
  }
function changeStatusProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    let index = products.findIndex(item => {
        return item.id == id;
    })
    if (confirm("Bạn có chắc chắn muốn hủy xóa?") == true) {
        products[index].status = 1;
        toast({ title: 'Success', message: 'Khôi phục sản phẩm thành công !', type: 'success', duration: 3000 });
    }
    localStorage.setItem("products", JSON.stringify(products));
    showProduct();
}

var indexCur;
function editProduct(id) {
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
    let index = products.findIndex(item => {
        return item.id == id;
    })
    indexCur = index;
    document.querySelectorAll(".add-product-e").forEach(item => {
        item.style.display = "none";
    })
    document.querySelectorAll(".edit-product-e").forEach(item => {
        item.style.display = "block";
    })
    document.querySelector(".add-product").classList.add("open");
    //
    document.querySelector(".upload-image-preview").src = products[index].img;
    document.getElementById("ten-sach").value = products[index].title;
    document.getElementById("gia-moi").value = products[index].price;
    document.getElementById("mo-ta").value = products[index].desc;
    document.getElementById("chon-sach").value = products[index].category;
}
function getPathImage(path) {
    let patharr = path.split("/");
    return "./image/" + patharr[patharr.length - 1];
}

let btnUpdateProductIn = document.getElementById("update-product-button");
btnUpdateProductIn.addEventListener("click", (e) => {
    e.preventDefault();

    // Lấy thông tin sản phẩm từ localStorage
    let products = JSON.parse(localStorage.getItem("products"));
    let idProduct = products[indexCur].id;
    let imgProduct = products[indexCur].img;
    let titleProduct = products[indexCur].title;
    let curProduct = products[indexCur].price;
    let descProduct = products[indexCur].desc;
    let categoryProduct = products[indexCur].category;

    // Lấy giá trị hiện tại từ người dùng nhập
    let imgProductCur = getPathImage(document.querySelector(".upload-image-preview").src)
    let titleProductCur = document.getElementById("ten-sach").value;
    let curProductCur = document.getElementById("gia-moi").value;
    let descProductCur = document.getElementById("mo-ta").value;
    let categoryText = document.getElementById("chon-sach").value;

    // Kiểm tra xem các trường bắt buộc có được điền không
    if (titleProductCur === "" || curProductCur === "" || descProductCur === "") {
        // Hiển thị thông báo cảnh báo nếu có trường nào đó chưa được điền
        toast({ title: "Chú ý", message: "Vui lòng nhập đầy đủ thông tin!", type: "warning", duration: 3000 });
    } else {
        // Kiểm tra xem giá có phải là số dương hợp lệ không
        if (/^\d+$/.test(curProductCur)) {
            // Kiểm tra xem giá có là số dương không
            if (parseInt(curProductCur) >= 0) {
                // Cập nhật thông tin sản phẩm
                let productadd = {
                    id: idProduct,
                    title: titleProductCur,
                    img: imgProductCur,
                    category: categoryText,
                    price: parseInt(curProductCur),
                    desc: descProductCur,
                    status: 1,
                };

                // Loại bỏ sản phẩm cũ và thêm sản phẩm đã cập nhật
                products.splice(indexCur, 1);
                products.splice(indexCur, 0, productadd);

                // Lưu sản phẩm đã cập nhật vào localStorage
                localStorage.setItem("products", JSON.stringify(products));

                // Hiển thị thông báo thành công
                toast({ title: "Thành công", message: "Sửa sản phẩm thành công!", type: "success", duration: 3000 });

                // Đặt lại giá trị mặc định và đóng form
                setDefaultValue();
                document.querySelector(".add-product").classList.remove("open");

                // Làm mới danh sách sản phẩm
                showProduct();
            } else {
                // Hiển thị thông báo lỗi nếu giá là số âm
                toast({ title: "Chú ý", message: "Giá không thể là số âm!", type: "warning", duration: 3000 });
            }
        } else {
            // Hiển thị thông báo lỗi nếu giá chứa chữ
            toast({ title: "Chú ý", message: "Giá phải ở dạng số!", type: "warning", duration: 3000 });
        }
    }
});


let btnAddProductIn = document.getElementById("add-product-button");
btnAddProductIn.addEventListener("click", (e) => {
    e.preventDefault();

    // Lấy giá trị từ người dùng nhập
    let imgProduct = getPathImage(document.querySelector(".upload-image-preview").src)
    let tensach = document.getElementById("ten-sach").value;
    let price = document.getElementById("gia-moi").value;
    let moTa = document.getElementById("mo-ta").value;
    let categoryText = document.getElementById("chon-sach").value;

    // Kiểm tra xem các trường bắt buộc có được điền không
    if (tensach === "" || price === "" || moTa === "") {
        // Hiển thị thông báo cảnh báo nếu có trường nào đó chưa được điền
        toast({ title: "Chú ý", message: "Vui lòng nhập đầy đủ thông tin!", type: "warning", duration: 3000 });
    } else {
        // Kiểm tra xem giá có phải là số dương hợp lệ không
        if (/^\d+$/.test(price)) {
            // Kiểm tra xem giá có là số dương không
            if (parseInt(price) >= 0) {
                // Tạo một đối tượng sản phẩm mới
                let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
                let product = {
                    id: createId(products),
                    title: tensach,
                    img: imgProduct,
                    category: categoryText,
                    price: parseInt(price),
                    desc: moTa,
                    status: 1};

                    // Thêm sản phẩm mới vào đầu danh sách
                    products.unshift(product);
    
                    // Lưu danh sách sản phẩm mới vào localStorage
                    localStorage.setItem("products", JSON.stringify(products));
                    // Hiển thị danh sách sản phẩm
                    showProduct();
                    // Đóng form thêm sản phẩm
                    document.querySelector(".add-product").classList.remove("open");
    
                    // Hiển thị thông báo thành công
                    toast({ title: "Thành công", message: "Thêm sản phẩm thành công!", type: "success", duration: 3000 });
    
                    // Đặt lại giá trị mặc định của form
                    setDefaultValue();
                } else {
                    // Hiển thị thông báo lỗi nếu giá là số âm
                    toast({ title: "Chú ý", message: "Giá không thể là số âm!", type: "warning", duration: 3000 });
                }
            } else {
                // Hiển thị thông báo lỗi nếu giá không phải là số
                toast({ title: "Chú ý", message: "Giá phải ở dạng số!", type: "warning", duration: 3000 });
            }
        }
    });
function setDefaultValue() {
    document.getElementById("ten-sach").value = "";
    document.getElementById("gia-moi").value = "";
    document.getElementById("mo-ta").value = "";
    document.getElementById("chon-sach").value = "";
}
let btnAddProduct = document.getElementById("btn-add-product");
btnAddProduct.addEventListener("click", () => {
    document.querySelectorAll(".add-product-e").forEach(item => {
        item.style.display = "block";
    })
    document.querySelectorAll(".edit-product-e").forEach(item => {
        item.style.display = "none";
    })
    document.querySelector(".add-product").classList.add("open");
});

let closePopup = document.querySelectorAll(".modal-close");
let modalPopup = document.querySelectorAll(".modal");

for (let i = 0; i < closePopup.length; i++) {
    closePopup[i].onclick = () => {
        modalPopup[i].classList.remove("open");
    };
}
// On change Image
function uploadImage(el) {
    let path = "./image/" + el.value.split("\\")[2];
    document.querySelector(".upload-image-preview").setAttribute("src", path);
}
// Đổi trạng thái đơn hàng
function changeStatus(id, el) {
    let orders = JSON.parse(localStorage.getItem("order"));
    let order = orders.find((item) => {
        return item.id == id;
    });
    order.trangthai = 1;
    el.classList.remove("btn-chuaxuly");
    el.classList.add("btn-daxuly");
    el.innerHTML = "Đã xử lý";
    localStorage.setItem("order", JSON.stringify(orders));

    // Reload trang sau khi cập nhật trạng thái
    location.reload();
}
// Format Date
function formatDate(date) {
    let fm = new Date(date);
    let Year = fm.getFullYear();
    let Month = fm.getMonth() + 1;
    let Day = fm.getDate();
    if (Day < 10) Day = "0" + Day;
    if (Month < 10) Month = "0" + Month;
    return Day + "/" + Month + "/" + Year;
}
// Show order
function showOrder(arr) {
    let orderHtml = "";
    if(arr.length == 0) {
        orderHtml = `<td colspan="6">Không có dữ liệu</td>`
    } else {
        arr.forEach((item) => {
            let status = item.trangthai == 0 ? `<span class="status-no-complete">Chưa xử lý</span>` : `<span class="status-complete">Đã xử lý</span>`;
            let date = formatDate(item.thoigiandat);
            orderHtml += `
            <tr>
            <td>${item.id}</td>
            <td>${item.khachhang}</td>
            <td>${date}</td>
            <td>${vnd(item.tongtien)}</td>                               
            <td>${status}</td>
            <td class="control">
            <button class="btn-detail" id="" onclick="detailOrder('${item.id}')"><i class="fa fa-eye"></i> Chi tiết</button>
            </td>
            </tr>      
            `;
        });
    }
    document.getElementById("showOrder").innerHTML = orderHtml;
}
let orders = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
window.onload = showOrder(orders);
function getOrderDetails(madon) {
    let orderDetails = localStorage.getItem("orderDetails") ?
        JSON.parse(localStorage.getItem("orderDetails")) : [];
    let ctDon = [];
    orderDetails.forEach((item) => {
        if (item.madon == madon) {
            ctDon.push(item);
        }
    });
    return ctDon;
}
// Show Order Detail
function detailOrder(id) {
    document.querySelector(".modal.detail-order").classList.add("open");
    let orders = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
    let products = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("products")) : [];
    // Lấy hóa đơn 
    let order = orders.find((item) => item.id == id);
    // Lấy chi tiết hóa đơn
    let ctDon = getOrderDetails(id);
    let spHtml = `<div class="modal-detail-left"><div class="order-item-group">`;
    ctDon.forEach((item) => {
        let detaiSP = products.find(product => product.id == item.id);
        spHtml += `<div class="order-product">
            <div class="order-product-left">
                <img src="${detaiSP.img}" alt="">
                <div class="order-product-info">
                    <h4>${detaiSP.title}</h4>
                    <p class="order-product-note"><i class="fa fa-pen"></i> ${item.note}</p>
                    <p class="order-product-quantity">SL: ${item.soluong}<p>
                </div>
            </div>
            <div class="order-product-right">
                <div class="order-product-price">
                    <span class="order-product-current-price">${vnd(item.price)}</span>
                </div>                         
            </div>
        </div>`;
    });
    spHtml += `</div></div>`;
    spHtml += `<div class="modal-detail-right">
        <ul class="detail-order-group">
            <li class="detail-order-item">
                <span class="detail-order-item-left"><i class=""></i> Ngày đặt hàng</span>
                <span class="detail-order-item-right">${formatDate(order.thoigiandat)}</span>
            </li>
            <li class="detail-order-item">
                <span class="detail-order-item-left"><i class="fa fa-truck"></i> Hình thức giao</span>
                <span class="detail-order-item-right">${order.hinhthucgiao}</span>
            </li>
            <li class="detail-order-item">
            <span class="detail-order-item-left"><i class="fa fa-person"></i> Người nhận</span>
            <span class="detail-order-item-right">${order.tenguoinhan}</span>
            </li>
            <li class="detail-order-item">
            <span class="detail-order-item-left"><i class="fa fa-phone"></i> Số điện thoại</span>
            <span class="detail-order-item-right">${order.sdtnhan}</span>
            </li>
            <li class="detail-order-item tb">
                <span class="detail-order-item-left"><i class="fa fa-clock"></i> Thời gian giao</span>
                <p class="detail-order-item-b">${(order.thoigiangiao == "" ? "" : (order.thoigiangiao + " - ")) + formatDate(order.ngaygiaohang)}</p>
            </li>
            <li class="detail-order-item tb">
                <span class="detail-order-item-t"><i class=""></i> Địa chỉ nhận</span>
                <p class="detail-order-item-b">${order.diachinhan}</p>
            </li>
            <li class="detail-order-item tb">
                <span class="detail-order-item-t"><i class="fa fa-note"></i> Ghi chú</span>
                <p class="detail-order-item-b">${order.ghichu}</p>
            </li>
        </ul>
    </div>`;
    document.querySelector(".modal-detail-order").innerHTML = spHtml;
    let classDetailBtn = order.trangthai == 0 ? "btn-chuaxuly" : "btn-daxuly";
    let textDetailBtn = order.trangthai == 0 ? "Chưa xử lý" : "Đã xử lý";
    document.querySelector(
        ".modal-detail-bottom"
    ).innerHTML = `<div class="modal-detail-bottom-left">
        <div class="price-total">
            <span class="thanhtien">Thành tiền</span>
            <span class="price">${vnd(order.tongtien)}</span>
        </div>
    </div>
    <div class="modal-detail-bottom-right">
        <button class="modal-detail-btn ${classDetailBtn}" onclick="changeStatus('${order.id}',this)">${textDetailBtn}</button>
    </div>`;
}
function findOrder() {
    let tinhTrang = parseInt(document.getElementById("tinh-trang").value);
    let ct = document.getElementById("form-search-order").value;
    let timeStart = document.getElementById("time-start").value;
    let timeEnd = document.getElementById("time-end").value;
    
    if (timeEnd < timeStart && timeEnd != "" && timeStart != "") {
        toast({ title: 'Thất bại', message: 'lựa chọn sai thời gian !', type: 'warning', duration: 2000 });
        return;
    }
    let orders = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
    let result = tinhTrang == 2 ? orders : orders.filter((item) => {
        return item.trangthai == tinhTrang;
    });
    result = ct == "" ? result : result.filter((item) => {
        return (item.khachhang.toLowerCase().includes(ct.toLowerCase()) || item.id.toString().toLowerCase().includes(ct.toLowerCase()));
    });
    showOrder(result);
}
function cancelSearchOrder(){
    let orders = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
    document.getElementById("tinh-trang").value = 2;
    document.getElementById("form-search-order").value = "";
    document.getElementById("time-start").value = "";
    document.getElementById("time-end").value = "";
    showOrder(orders);
}

function createObj() {
    let orders = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : []; 
    let orderDetails = localStorage.getItem("orderDetails") ? JSON.parse(localStorage.getItem("orderDetails")) : []; 
    
    let result = [];
    orderDetails.forEach(item => {
        // Lấy thông tin sản phẩm
        let prod = products.find(product => {return product.id == item.id;});
        let order = orders.find(order => order.id == item.madon);
        
        // Kiểm tra trạng thái của đơn hàng
        if (order && order.trangthai === 1) {
            let obj = new Object();
            obj.id = item.id;
            obj.madon = item.madon;
            obj.price = item.price;
            obj.quantity = item.soluong;
            obj.category = prod.category;
            obj.title = prod.title;
            obj.img = prod.img;
            obj.time = order.thoigiandat;
            result.push(obj);
        }
    });
    return result;
}


// Filter 
function thongKe(mode) {
    let categoryTk = document.getElementById("the-loai-tk").value;
    let ct = document.getElementById("form-search-tk").value;
    let timeStart = document.getElementById("time-start-tk").value;
    let timeEnd = document.getElementById("time-end-tk").value;
    if (timeEnd < timeStart && timeEnd != "" && timeStart != "" ) {
        toast({ title: 'Thất bại', message: 'lựa chọn sai thời gian !', type: 'warning', duration: 2000 });
        return;
    }
    let arrDetail = createObj();
    let result = categoryTk == "Tất cả" ? arrDetail : arrDetail.filter((item) => {
        return item.category == categoryTk;
    });

    result = ct == "" ? result : result.filter((item) => {
        return (item.title.toLowerCase().includes(ct.toLowerCase()));
    });

    if (timeStart != "" && timeEnd == "") {
        result = result.filter((item) => {
            return new Date(item.time) > new Date(timeStart).setHours(0, 0, 0);
        });
    } else if (timeStart == "" && timeEnd != "") {
        result = result.filter((item) => {
            return new Date(item.time) < new Date(timeEnd).setHours(23, 59, 59);
        });
    } else if (timeStart != "" && timeEnd != "") {
        result = result.filter((item) => {
            return (new Date(item.time) > new Date(timeStart).setHours(0, 0, 0) && new Date(item.time) < new Date(timeEnd).setHours(23, 59, 59)
            );
        });
    }    
    showThongKe(result,mode);
}

//tổng quan về thống kê, bao gồm số lượng sản phẩm, số lượng đơn hàng và tổng doanh thu.
function showOverview(arr) {
    // Quantity Product
    document.getElementById("quantity-product").innerText = arr.length;

    // Quantity Order
    let quantityOrder = 0;
    for (let i = 0; i < arr.length; i++) {
        quantityOrder += parseInt(arr[i].quantity);
    }
    document.getElementById("quantity-order").innerText = quantityOrder;

    // Quantity Sale
    let quantitySale = 0;
    for (let i = 0; i < arr.length; i++) {
        quantitySale += parseInt(arr[i].doanhthu);
    }
    document.getElementById("quantity-sale").innerText = vnd(quantitySale);
}

function showThongKe(arr,mode) {
    let orderHtml = "";
    let mergeObj = mergeObjThongKe(arr);
    showOverview(mergeObj);

    switch (mode){
        case 0:
            mergeObj = mergeObjThongKe(createObj());
            showOverview(mergeObj);
            document.getElementById("the-loai-tk").value = "Tất cả";
            document.getElementById("form-search-tk").value = "";
            document.getElementById("time-start-tk").value = "";
            document.getElementById("time-end-tk").value = "";
            break;
        case 1:
            mergeObj.sort((a,b) => parseInt(a.quantity) - parseInt(b.quantity))
            break;
        case 2:
            mergeObj.sort((a,b) => parseInt(b.quantity) - parseInt(a.quantity))
            break;
    }
    for(let i = 0; i < mergeObj.length; i++) {
        orderHtml += `
        <tr>
        <td>${i + 1}</td>
        <td><div class="prod-img-title"><img class="prd-img-tbl" src="${mergeObj[i].img}" alt=""><p>${mergeObj[i].title}</p></div></td>
        <td>${mergeObj[i].quantity}</td>
        <td>${vnd(mergeObj[i].doanhthu)}</td>
        <td><button class="btn-detail product-order-detail" data-id="${mergeObj[i].id}"><i class="fa fa-eye"></i> Chi tiết</button></td>
        </tr>      
        `;
    }
    document.getElementById("showTk").innerHTML = orderHtml;
    document.querySelectorAll(".product-order-detail").forEach(item => {
        let idProduct = item.getAttribute("data-id");
        item.addEventListener("click", () => {           
            detailOrderProduct(arr,idProduct);
        })
    })
}

showThongKe(createObj())

function mergeObjThongKe(arr) {
    let result = [];
    arr.forEach(item => {
        let check = result.find(i => i.id == item.id) // Không tìm thấy gì trả về undefined

        if(check){
            check.quantity = parseInt(check.quantity)  + parseInt(item.quantity);
            check.doanhthu += parseInt(item.price) * parseInt(item.quantity);
        } else {
            const newItem = {...item}
            newItem.doanhthu = newItem.price * newItem.quantity;
            result.push(newItem);
        }
        
    });
    return result;
}

function detailOrderProduct(arr,id) {
    let orderHtml = "";
    arr.forEach(item => {
        if(item.id == id) {
            orderHtml += `<tr>
            <td>${item.madon}</td>
            <td>${item.quantity}</td>
            <td>${vnd(item.price)}</td>
            <td>${formatDate(item.time)}</td>
            </tr>      
            `;
        }
    });
    document.getElementById("show-product-order-detail").innerHTML = orderHtml
    document.querySelector(".modal.detail-order-product").classList.add("open")
}

// User
let addAccount = document.getElementById('signup-button');
let updateAccount = document.getElementById("btn-update-account")
document.querySelector(".modal.signup .modal-close").addEventListener("click",() => {
    signUpFormReset();
})
function openCreateAccount() {
    document.querySelector(".signup").classList.add("open");
    document.querySelectorAll(".edit-account-e").forEach(item => {
        item.style.display = "none"
    })
    document.querySelectorAll(".add-account-e").forEach(item => {
        item.style.display = "block"
    })
}
function signUpFormReset() {
    document.getElementById('fullname').value = ""
    document.getElementById('phone').value = ""
    document.getElementById('password').value = ""
    document.querySelector('.form-message-name').innerHTML = '';
    document.querySelector('.form-message-phone').innerHTML = '';
    document.querySelector('.form-message-password').innerHTML = '';
}
function showUserArr(arr) {
    let accountHtml = '';
    if(arr.length == 0) {
        accountHtml = `<td colspan="5">Không có dữ liệu</td>`
    } else {
        arr.forEach((account, index) => {
            let tinhtrang = account.status == 0 ? `<span class="status-no-complete">Bị khóa</span>` : `<span class="status-complete">Hoạt động</span>`;
            accountHtml += ` <tr>
            <td>${index + 1}</td>
            <td>${account.fullname}</td>
            <td>${account.phone}</td>
            <td>${formatDate(account.join)}</td>
            <td>${tinhtrang}</td>
            <td class="control control-table">
            <button class="btn-edit" id="edit-account" onclick='editAccount(${account.phone})' ><i class="fa fa-pencil"></i></button>
            <button class="btn-delete" id="delete-account" onclick="deleteAcount(${index})"><i class="fa fa-trash"></i></button>
            </td>
        </tr>`
        })
    }
    document.getElementById('show-user').innerHTML = accountHtml;
}
function showUser() {
    let tinhTrang = parseInt(document.getElementById("tinh-trang-user").value);
    let ct = document.getElementById("form-search-user").value;
    let timeStart = document.getElementById("time-start-user").value;
    let timeEnd = document.getElementById("time-end-user").value;
    if (timeEnd < timeStart && timeEnd != "" && timeStart != "") {
        toast({ title: 'Thất bại', message: 'lựa chọn sai thời gian !', type: 'warning', duration: 2000 });
        return;
    }
    let accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")).filter(item => item.userType == 0) : [];
    let result = tinhTrang == 2 ? accounts : accounts.filter(item => item.status == tinhTrang);
    result = ct == "" ? result : result.filter((item) => {
        return (item.fullname.toLowerCase().includes(ct.toLowerCase()) || item.phone.toString().toLowerCase().includes(ct.toLowerCase()));
    });
    showUserArr(result);
}
function cancelSearchUser() {
    let accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")).filter(item => item.userType == 0) : [];
    showUserArr(accounts);
    document.getElementById("tinh-trang-user").value = 2;
    document.getElementById("form-search-user").value = "";
    document.getElementById("time-start-user").value = "";
    document.getElementById("time-end-user").value = "";
}
window.onload = showUser();
function deleteAcount(phone) {
    let accounts = JSON.parse(localStorage.getItem('accounts'));
    let index = accounts.findIndex(item => item.phone == phone);
    if (confirm("Bạn có chắc muốn xóa?")) {
        accounts.splice(index, 1)
    }
    localStorage.setItem("accounts", JSON.stringify(accounts));
    showUser();
}
let indexFlag;
function editAccount(phone) {
    document.querySelector(".signup").classList.add("open");
    document.querySelectorAll(".add-account-e").forEach(item => {
        item.style.display = "none"
    })
    document.querySelectorAll(".edit-account-e").forEach(item => {
        item.style.display = "block"
    })
    let accounts = JSON.parse(localStorage.getItem("accounts"));
    let index = accounts.findIndex(item => {
        return item.phone == phone
    })
    indexFlag = index;
    document.getElementById("fullname").value = accounts[index].fullname;
    document.getElementById("phone").value = accounts[index].phone;
    document.getElementById("password").value = accounts[index].password;
    document.getElementById("user-status").checked = accounts[index].status == 1 ? true : false;
}
updateAccount.addEventListener("click", (e) => {
    e.preventDefault();
    let accounts = JSON.parse(localStorage.getItem("accounts"));
    let fullname = document.getElementById("fullname").value;
    let phone = document.getElementById("phone").value;
    let password = document.getElementById("password").value;
    if(fullname == "" || phone == "" || password == "") {
        toast({ title: 'Chú ý', message: 'Vui lòng nhập đầy đủ thông tin !', type: 'warning', duration: 2000 });
    } else {
        accounts[indexFlag].fullname = document.getElementById("fullname").value;
        accounts[indexFlag].phone = document.getElementById("phone").value;
        accounts[indexFlag].password = document.getElementById("password").value;
        accounts[indexFlag].status = document.getElementById("user-status").checked ? true : false;
        localStorage.setItem("accounts", JSON.stringify(accounts));
        toast({ title: 'Thành công', message: 'Thay đổi thông tin thành công !', type: 'success', duration: 2000 });
        document.querySelector(".signup").classList.remove("open");
        signUpFormReset();
        showUser();
    }
})

addAccount.addEventListener("click", (e) => {
    e.preventDefault();
    let fullNameUser = document.getElementById('fullname').value;
    let phoneUser = document.getElementById('phone').value;
    let passwordUser = document.getElementById('password').value;
       
        let formMessageName = document.querySelector('.form-message-name');
        let formMessagePhone = document.querySelector('.form-message-phone');
        let formMessagePassword = document.querySelector('.form-message-password');
    
        if (fullNameUser.length == 0) {
            formMessageName.innerHTML = 'Vui lòng nhập họ vâ tên';
            document.getElementById('fullname').focus();
        } 
 
        if (phoneUser.length == 0) {
            formMessagePhone.innerHTML = 'Vui lòng nhập vào số điện thoại';
        } else if (phoneUser.length != 10) {
            formMessagePhone.innerHTML = 'Vui lòng nhập vào số điện thoại 10 số';
            document.getElementById('phone').value = '';
        } else if (!/^\d+$/.test(phoneUser)) {
            formMessagePhone.innerHTML = 'Vui lòng chỉ nhập số điện thoại'
            document.getElementById('phone').value = '';
        } 

        if (passwordUser.length == 0) {
            formMessagePassword.innerHTML = 'Vui lòng nhập mật khẩu';
        } else if (passwordUser.length < 8) {
            formMessagePassword.innerHTML = 'Vui lòng nhập mật khẩu lớn hơn 8 kí tự';
            document.getElementById('password').value = '';
        }
    if ( fullNameUser && /^\d+$/.test(phoneUser) && phoneUser.length == 10 && passwordUser.length >= 8 ){
        let user = {
            fullname: fullNameUser,
            phone: phoneUser,
            password: passwordUser,
            status: 1,
            join: new Date(),
            cart: [],
            userType: 0
        }
        console.log(user);
        let accounts = localStorage.getItem('accounts') ? JSON.parse(localStorage.getItem('accounts')) : [];
        let checkloop = accounts.some(account => {
            return account.phone == user.phone;
        })
        if (!checkloop) {
            accounts.push(user);
            localStorage.setItem('accounts', JSON.stringify(accounts));
            toast({ title: 'Thành công', message: 'Tạo thành công tài khoản !', type: 'success', duration: 3000 });
            document.querySelector(".signup").classList.remove("open");
            showUser();
            signUpFormReset();
        } else {
            toast({ title: 'Cảnh báo !', message: 'Tài khoản đã tồn tại !', type: 'warning', duration: 3000 });
        }
    }
})

document.getElementById("logout-acc").addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem("currentuser");
    window.location.href = "index.html";
})