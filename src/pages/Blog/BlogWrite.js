import React from "react";
import { writePost, updatePost } from "../../services/blogAPI"; // blogAPI.js에서 import
import "../../styles/BlogWrite.css";
import {useLocation, useNavigate} from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';

const LICENSE_KEY = 
    '';

    const BlogWrite = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const postToEdit = location.state?.post || null; // 수정할 게시물 정보
    const isMyPageEdit = location.state?.isMyPageEdit || false;  // 마이페이지에서 수정 여부

    // 상태 초기화
    const [title, setTitle] = useState(postToEdit?.title || "");
    const [contents, setContents] = useState(postToEdit?.contents || "");
    const [tag, setTag] = useState(postToEdit?.tag || "");
    const [category, setCategory] = useState(postToEdit?.category || "");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null); // 이미지 미리보기 URL

    // 이미지 변경 핸들러
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        // 이미지 미리보기 URL 설정
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = async () => {
        if (!category) {
            alert("게시판을 선택해주세요."); // 카테고리가 선택되지 않으면 알림 표시
            return;
        }

        try {
            if (postToEdit) {
                // 수정 요청
                await updatePost({
                    boardId: postToEdit.boardId,
                    category,
                    title,
                    contents,
                    tag,
                    createAt: new Date().toISOString(),
                    image,
                });
                alert("게시물이 수정되었습니다.");
            } else {
                // 등록 요청
                const formData = new FormData();
                formData.append("category", category);
                formData.append("title", title);
                formData.append("contents", contents);
                formData.append("tag", tag);
                formData.append("roleType", "USER");
                formData.append("createAt", new Date().toISOString());
                if (image) formData.append("image", image);

                await writePost(formData);
                alert("게시물이 등록되었습니다.");
            }

            // 페이지 이동
            navigate(isMyPageEdit ? "/mypage" : "/blog");
        } catch (error) {
            console.error("글 등록/수정 실패:", error);
            alert("글 등록/수정에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const editorContainerRef = useRef(null);
	const editorRef = useRef(null);
	const [isLayoutReady, setIsLayoutReady] = useState(false);
	const cloud = useCKEditorCloud({ version: '44.1.0', translations: ['ko'] });

	useEffect(() => {
		setIsLayoutReady(true);

		return () => setIsLayoutReady(false);
	}, []);

	const { ClassicEditor, editorConfig } = useMemo(() => {
		if (cloud.status !== 'success' || !isLayoutReady) {
			return {};
		}

		const {
			ClassicEditor,
			Autoformat,
			AutoImage,
			Autosave,
			BlockQuote,
			Bold,
			CloudServices,
			Code,
			Essentials,
			FontBackgroundColor,
			FontColor,
			FontFamily,
			FontSize,
			Heading,
			ImageBlock,
			ImageCaption,
			ImageInline,
			ImageInsert,
			ImageInsertViaUrl,
			ImageResize,
			ImageStyle,
			ImageTextAlternative,
			ImageToolbar,
			ImageUpload,
			Indent,
			IndentBlock,
			Italic,
			Link,
			LinkImage,
			List,
			ListProperties,
			MediaEmbed,
			Paragraph,
			PasteFromOffice,
			SimpleUploadAdapter,
			Strikethrough,
			Table,
			TableCaption,
			TableCellProperties,
			TableColumnResize,
			TableProperties,
			TableToolbar,
			TextTransformation,
			TodoList,
			Underline
		} = cloud.CKEditor;

		return {
			ClassicEditor,
			editorConfig: {
				toolbar: {
					items: [
						'heading',
						'|',
						'fontSize',
						'fontFamily',
						'fontColor',
						'fontBackgroundColor',
						'|',
						'bold',
						'italic',
						'underline',
						'strikethrough',
						'code',
						'|',
						'link',
						'insertImage',
						'mediaEmbed',
						'insertTable',
						'blockQuote',
						'|',
						'bulletedList',
						'numberedList',
						'todoList',
						'outdent',
						'indent'
					],
					shouldNotGroupWhenFull: false
				},
				plugins: [
					Autoformat,
					AutoImage,
					Autosave,
					BlockQuote,
					Bold,
					CloudServices,
					Code,
					Essentials,
					FontBackgroundColor,
					FontColor,
					FontFamily,
					FontSize,
					Heading,
					ImageBlock,
					ImageCaption,
					ImageInline,
					ImageInsert,
					ImageInsertViaUrl,
					ImageResize,
					ImageStyle,
					ImageTextAlternative,
					ImageToolbar,
					ImageUpload,
					Indent,
					IndentBlock,
					Italic,
					Link,
					LinkImage,
					List,
					ListProperties,
					MediaEmbed,
					Paragraph,
					PasteFromOffice,
					SimpleUploadAdapter,
					Strikethrough,
					Table,
					TableCaption,
					TableCellProperties,
					TableColumnResize,
					TableProperties,
					TableToolbar,
					TextTransformation,
					TodoList,
					Underline
				],
				fontFamily: {
					supportAllValues: true
				},
				fontSize: {
					options: [10, 12, 14, 'default', 18, 20, 22],
					supportAllValues: true
				},
				heading: {
					options: [
						{
							model: 'paragraph',
							title: 'Paragraph',
							class: 'ck-heading_paragraph'
						},
						{
							model: 'heading1',
							view: 'h1',
							title: 'Heading 1',
							class: 'ck-heading_heading1'
						},
						{
							model: 'heading2',
							view: 'h2',
							title: 'Heading 2',
							class: 'ck-heading_heading2'
						},
						{
							model: 'heading3',
							view: 'h3',
							title: 'Heading 3',
							class: 'ck-heading_heading3'
						},
						{
							model: 'heading4',
							view: 'h4',
							title: 'Heading 4',
							class: 'ck-heading_heading4'
						},
						{
							model: 'heading5',
							view: 'h5',
							title: 'Heading 5',
							class: 'ck-heading_heading5'
						},
						{
							model: 'heading6',
							view: 'h6',
							title: 'Heading 6',
							class: 'ck-heading_heading6'
						}
					]
				},
				image: {
					toolbar: [
						'toggleImageCaption',
						'imageTextAlternative',
						'|',
						'imageStyle:inline',
						'imageStyle:wrapText',
						'imageStyle:breakText',
						'|',
						'resizeImage'
					]
				},
				initialData:
					'<h2>Congratulations on setting up CKEditor 5! 🎉</h2>\n<p>\n\tYou\'ve successfully created a CKEditor 5 project. This powerful text editor\n\twill enhance your application, enabling rich text editing capabilities that\n\tare customizable and easy to use.\n</p>\n<h3>What\'s next?</h3>\n<ol>\n\t<li>\n\t\t<strong>Integrate into your app</strong>: time to bring the editing into\n\t\tyour application. Take the code you created and add to your application.\n\t</li>\n\t<li>\n\t\t<strong>Explore features:</strong> Experiment with different plugins and\n\t\ttoolbar options to discover what works best for your needs.\n\t</li>\n\t<li>\n\t\t<strong>Customize your editor:</strong> Tailor the editor\'s\n\t\tconfiguration to match your application\'s style and requirements. Or\n\t\teven write your plugin!\n\t</li>\n</ol>\n<p>\n\tKeep experimenting, and don\'t hesitate to push the boundaries of what you\n\tcan achieve with CKEditor 5. Your feedback is invaluable to us as we strive\n\tto improve and evolve. Happy editing!\n</p>\n<h3>Helpful resources</h3>\n<ul>\n\t<li>📝 <a href="https://portal.ckeditor.com/checkout?plan=free">Trial sign up</a>,</li>\n\t<li>📕 <a href="https://ckeditor.com/docs/ckeditor5/latest/installation/index.html">Documentation</a>,</li>\n\t<li>⭐️ <a href="https://github.com/ckeditor/ckeditor5">GitHub</a> (star us if you can!),</li>\n\t<li>🏠 <a href="https://ckeditor.com">CKEditor Homepage</a>,</li>\n\t<li>🧑‍💻 <a href="https://ckeditor.com/ckeditor-5/demo/">CKEditor 5 Demos</a>,</li>\n</ul>\n<h3>Need help?</h3>\n<p>\n\tSee this text, but the editor is not starting up? Check the browser\'s\n\tconsole for clues and guidance. It may be related to an incorrect license\n\tkey if you use premium features or another feature-related requirement. If\n\tyou cannot make it work, file a GitHub issue, and we will help as soon as\n\tpossible!\n</p>\n',
				licenseKey: LICENSE_KEY,
				link: {
					addTargetToExternalLinks: true,
					defaultProtocol: 'https://',
					decorators: {
						toggleDownloadable: {
							mode: 'manual',
							label: 'Downloadable',
							attributes: {
								download: 'file'
							}
						}
					}
				},
				list: {
					properties: {
						styles: true,
						startIndex: true,
						reversed: true
					}
				},
				placeholder: 'Type or paste your content here!',
				table: {
					contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
				}
			}
		};
	}, [cloud, isLayoutReady]);

    return (
        <div className="blog-write">
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="category-select"
            >
                <option value="" disabled hidden>
                    게시판 선택
                </option>
                <option value="0">공지사항</option>
                <option value="1">성과</option>
                <option value="2">정보</option>
                <option value="3">후기</option>
                <option value="4">활동</option>
            </select>
            <input
                type="text"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="title-input"
            />
            <div className="main-container">
                <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
                    <div className="editor-container__editor">
                        <div ref={editorRef}>{ClassicEditor && editorConfig && <CKEditor editor={ClassicEditor} config={editorConfig} />}</div>
                    </div>
                </div>
            </div>
            <div className="tag-input">
                <input
                    type="text"
                    placeholder="#태그 입력"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                />
            </div>
            <div className="image-upload">
                <label htmlFor="image-upload"/>
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                {preview && (
                    <div className="image-preview">
                        <img src={preview} alt="미리보기"/>
                    </div>
                )}
            </div>
            <div className="buttons-container">
                <button className="submit-button" onClick={handleSubmit}>
                    {postToEdit 
                        ? (isMyPageEdit ? "수정 완료" : "수정 완료") 
                        : "완료"}
                </button>
            </div>
        </div>
    );
};

export default BlogWrite;
